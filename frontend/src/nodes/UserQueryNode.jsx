import { Handle, Position } from "reactflow";

export default function UserQueryNode() {
  return (
    <div className="border bg-white p-3 rounded w-64">
      <strong>User Query</strong>
      <textarea className="border w-full mt-1" placeholder="Enter query" />

      {/* OUTPUT */}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
