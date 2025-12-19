import { Handle, Position } from "reactflow";

export default function OutputNode() {
  return (
    <div className="border bg-white p-3 rounded w-64">
      <strong>Output</strong>
      <p className="text-xs text-gray-500">Final Response</p>

      {/* INPUT */}
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
