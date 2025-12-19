const components = [
  { type: "userQuery", label: "User Query" },
  { type: "knowledgeBase", label: "Knowledge Base" },
  { type: "webSearch", label: "Web Search" },
  { type: "llm", label: "LLM (Gemini / OpenAI)" },
  { type: "output", label: "Output" },
];

export default function Sidebar({ onPdfUpload }) {
  const onDragStart = (e, type) => {
    e.dataTransfer.setData("application/reactflow", type);
    e.dataTransfer.effectAllowed = "move";
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && onPdfUpload) {
      onPdfUpload(file);
    }
  };

  return (
    <div className="w-64 border-r p-4 bg-gray-50">
      <h3 className="font-semibold mb-3">Components</h3>

      {components.map((c) => (
        <div
          key={c.type}
          draggable
          onDragStart={(e) => onDragStart(e, c.type)}
          className="border p-2 mb-2 rounded cursor-move bg-white"
        >
          {c.label}
        </div>
      ))}

      <div className="mt-6">
        <h4 className="font-semibold mb-2">Knowledge Base</h4>

        <input
          type="file"
          accept="application/pdf"
          id="pdf-upload"
          className="hidden"
          onChange={handlePdfUpload}
        />

        <label
          htmlFor="pdf-upload"
          className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded block text-center"
        >
          Upload PDF
        </label>
      </div>
    </div>
  );
}
