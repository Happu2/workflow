import { Handle, Position } from "reactflow";

export default function WebSearchNode() {
  return (
    <div className="border bg-white p-3 rounded w-64">
      <strong>Web Search</strong>
      <p className="text-xs text-gray-500">Search the web for information</p>

      {/* INPUT */}
      <Handle type="target" position={Position.Left} />

      {/* OUTPUT */}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}