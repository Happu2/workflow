import { Handle, Position } from "reactflow";

export default function KnowledgeBaseNode({ data }) {
  return (
    <div className="border bg-white p-3 rounded w-64 shadow">
      <strong>Knowledge Base</strong>
      <p className="text-xs text-gray-500 mb-2">
        PDF / Vector Store
      </p>

      {/* ✅ Show uploaded PDF info */}
      {data?.filename ? (
        <div className="text-xs text-green-600 mb-2">
          📄 {data.filename}
          {data.chunks && <div className="text-gray-500">({data.chunks} chunks)</div>}
        </div>
      ) : (
        <div className="text-xs text-red-500 mb-2">
          No PDF uploaded
        </div>
      )}

      {/* ✅ Optional preview (safe + limited) */}
      {data?.text && (
        <div className="text-xs bg-gray-100 p-2 rounded max-h-24 overflow-auto">
          {data.text.slice(0, 300)}...
        </div>
      )}

      {/* INPUT */}
      <Handle type="target" position={Position.Left} />

      {/* OUTPUT */}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
