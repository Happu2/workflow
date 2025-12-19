import { useState } from "react";
import { streamChat } from "../api/api";

export default function ChatModal({ open, onClose, workflow, stackId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  if (!open) return null;

  const send = async () => {
    const userMsg = input;
    setInput("");

    setMessages((m) => [...m, { role: "user", text: userMsg }]);

    let aiText = "";
    setMessages((m) => [...m, { role: "ai", text: "" }]);

    await streamChat(workflow, userMsg, stackId, (chunk) => {
      aiText += chunk;
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1].text = aiText;
        return copy;
      });
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[700px] h-[500px] rounded flex flex-col">
        <div className="border-b p-3 font-semibold flex justify-between">
          Chat with Stack
          <button onClick={onClose}>✕</button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-left" : "text-right"}>
              <div className="inline-block bg-gray-100 px-3 py-2 rounded">
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-3 flex gap-2">
          <input
            className="border flex-1 px-3 py-2 rounded"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
          />
          <button
            onClick={send}
            className="bg-green-600 text-white px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
