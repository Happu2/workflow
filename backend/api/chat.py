from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from services.workflow_executor import execute_workflow
from services.llm_service import stream_answer
from db.models import User
from api.auth import get_current_user

router = APIRouter()


@router.post("/stream")
def chat(payload: dict, current_user: User = Depends(get_current_user)):
    stack_id = payload.get("stack_id")
    if not stack_id:
        raise HTTPException(status_code=400, detail="stack_id is required")

    result = execute_workflow(
        workflow=payload["workflow"],
        user_query=payload["message"],
        stack_id=stack_id
    )

    if "error" in result:
        return StreamingResponse(
            iter([result["error"]]),
            media_type="text/plain"
        )

    return StreamingResponse(
        stream_answer(result["prompt"], result["model"]),
        media_type="text/plain"
    )
