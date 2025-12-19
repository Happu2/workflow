export function validateWorkflow(nodes, edges) {
  const types = nodes.map(n => n.type);
  if (!types.includes("userQuery")) return "User Query missing";
  if (!types.includes("llm")) return "LLM missing";
  if (!types.includes("output")) return "Output missing";
  if (edges.length < 2) return "Connect all nodes";
  return null;
}
