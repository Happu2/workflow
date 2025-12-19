export default function ComponentConfig({ selectedNode, onUpdateNode }) {
  if (!selectedNode) return null;

  const updateData = (key, value) => {
    onUpdateNode(selectedNode.id, { ...selectedNode.data, [key]: value });
  };

  return (
    <div className="w-64 border-l p-4 bg-gray-50">
      <h3 className="font-semibold mb-3">Configure {selectedNode.type}</h3>

      {selectedNode.type === "llm" && (
        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <select
            value={selectedNode.data?.model || "gemini"}
            onChange={(e) => updateData("model", e.target.value)}
            className="border w-full p-2 rounded"
          >
            <option value="gemini">Gemini</option>
            <option value="openai">OpenAI GPT-4</option>
          </select>
        </div>
      )}

      {selectedNode.type === "knowledgeBase" && (
        <div>
          <p className="text-sm text-gray-600">Upload PDFs via sidebar to populate knowledge base.</p>
        </div>
      )}

      {/* Add more configs as needed */}
    </div>
  );
}