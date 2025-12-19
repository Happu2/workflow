import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CreateStackModal from "../components/CreateStackModal";

export default function Stacks() {
  const [open, setOpen] = useState(false);
  const [stacks, setStacks] = useState([]);
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    fetchStacks();
  }, []);

  const fetchStacks = async () => {
    const res = await fetch("http://localhost:8003/workflow/stacks", {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    setStacks(data);
  };

  const openStack = (stackId) => {
    navigate(`/stack/${stackId}`);
  };

  const createStack = async (name, description) => {
    const res = await fetch("http://localhost:8003/workflow/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify({ name, description, nodes: [], edges: [] })
    });
    const data = await res.json();
    fetchStacks();
    setOpen(false);
    navigate(`/stack/${data.stack_id}`);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">My Stacks</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + New Stack
        </button>
      </div>

      {/* Stack Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {stacks.map((stack) => (
          <div
            key={stack.id}
            className="border p-4 rounded bg-white shadow-sm"
          >
            <h2 className="font-medium text-lg">{stack.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {stack.description}
            </p>

            <button
              onClick={() => openStack(stack.id)}
              className="mt-3 border px-3 py-1 rounded hover:bg-gray-100"
            >
              Edit Stack
            </button>
          </div>
        ))}
      </div>

      {/* Create Stack Modal */}
      <CreateStackModal open={open} setOpen={setOpen} onCreate={createStack} />
    </div>
  );
}
