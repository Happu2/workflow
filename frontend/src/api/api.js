export async function streamChat(workflow, message, stackId, onChunk) {
  const token = localStorage.getItem('token');
  const res = await fetch("http://localhost:8003/chat/stream", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ workflow, message, stack_id: stackId })
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    onChunk(decoder.decode(value));
  }
}
