from services.embedding_service import embed_texts
from services.chroma_service import search_vectors
from services.web_search_service import web_search
from db.database import SessionLocal
from db.models import ExecutionLog
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def log_execution(stack_id: int, user_query: str, component: str, status: str, message: str):
    """Log execution steps to database"""
    try:
        db = SessionLocal()
        log_entry = ExecutionLog(
            stack_id=stack_id,
            user_query=user_query,
            component=component,
            status=status,
            message=message
        )
        db.add(log_entry)
        db.commit()
        db.close()
    except Exception as e:
        logger.error(f"Failed to log execution: {e}")


def execute_workflow(workflow: dict, user_query: str, stack_id: int = None) -> dict:
    nodes = workflow.get("nodes", [])
    edges = workflow.get("edges", [])

    logger.info(f"Starting workflow execution for stack {stack_id} with query: {user_query}")

    # Build execution order based on edges
    # Simple topological sort assuming linear flow
    node_map = {node["id"]: node for node in nodes}
    executed = {}
    context = []

    # Find starting node (userQuery)
    start_node = next((n for n in nodes if n["type"] == "userQuery"), None)
    if not start_node:
        log_execution(stack_id, user_query, "workflow", "error", "No user query node found")
        return {"error": "No user query node"}

    executed[start_node["id"]] = user_query
    log_execution(stack_id, user_query, "userQuery", "success", f"User query received: {user_query}")

    # Traverse the graph
    current = start_node["id"]
    while True:
        outgoing = [e for e in edges if e["source"] == current]
        if not outgoing:
            break
        next_id = outgoing[0]["target"]  # Assume single connection
        next_node = node_map[next_id]

        if next_node["type"] == "knowledgeBase":
            try:
                log_execution(stack_id, user_query, "knowledgeBase", "info", "Starting knowledge base search")
                query_embedding = embed_texts([user_query])[0]
                docs = search_vectors(query_embedding)
                context_text = "\n".join(docs)
                context.append(context_text)
                executed[next_id] = "Context retrieved"
                log_execution(stack_id, user_query, "knowledgeBase", "success", f"Retrieved {len(docs)} documents")
            except Exception as e:
                log_execution(stack_id, user_query, "knowledgeBase", "error", f"Knowledge base search failed: {str(e)}")
                logger.error(f"Knowledge base error: {e}")

        elif next_node["type"] == "webSearch":
            try:
                log_execution(stack_id, user_query, "webSearch", "info", "Starting web search")
                search_results = web_search(user_query)
                context.append(search_results)
                executed[next_id] = "Web search completed"
                log_execution(stack_id, user_query, "webSearch", "success", "Web search completed successfully")

                # Collect all previous contexts
                prompt = f"""
You are a helpful AI assistant.
Answer based on the provided context.

Context:
{chr(10).join(context)}

Question:
{user_query}
""".strip()
                executed[next_id] = prompt
                log_execution(stack_id, user_query, "llm", "info", "Preparing prompt for LLM")
                return {"prompt": prompt, "model": next_node.get("data", {}).get("model", "gemini")}
            except Exception as e:
                log_execution(stack_id, user_query, "webSearch", "error", f"Web search failed: {str(e)}")
                logger.error(f"Web search error: {e}")

        elif next_node["type"] == "output":
            executed[next_id] = "Output ready"
            log_execution(stack_id, user_query, "output", "success", "Workflow execution completed")
            break

        current = next_id

    log_execution(stack_id, user_query, "workflow", "error", "Invalid workflow configuration")
    return {"error": "Invalid workflow"}
