import { Handle, Position } from "reactflow";

export default function LLMNode() {
  return (
    <div className="border bg-white p-3 rounded w-64">
      <strong>LLM (OpenAI)</strong>

      {/* INPUT */}
      <Handle type="target" position={Position.Left} />

      {/* OUTPUT */}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
