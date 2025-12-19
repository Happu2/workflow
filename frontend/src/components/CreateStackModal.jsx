import { useState } from "react";

export default function CreateStackModal({ open, setOpen, onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null;

  const handleCreate = () => {
    onCreate(name, description);
    setName("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="font-semibold mb-3">Create New Stack</h2>
        <input
          className="border w-full p-2 mb-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="border w-full p-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-3">
          <button onClick={() => setOpen(false)}>Cancel</button>
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
