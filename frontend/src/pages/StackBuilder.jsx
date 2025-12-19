import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import FlowCanvas from "../flow/FlowCanvas";
import ChatModal from "../components/ChatModal";
import ComponentConfig from "../components/ComponentConfig";
import { validateWorkflow } from "../utils/validateWorkflow";
import { useAuth } from "../contexts/AuthContext";

export default function StackBuilder() {
  const { id } = useParams();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [stackName, setStackName] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (id) {
      loadStack();
    }
  }, [id]);

  const loadStack = async () => {
    const res = await fetch(`http://localhost:8003/workflow/stack/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    setNodes(data.nodes || []);
    setEdges(data.edges || []);
    setStackName(data.name || "");
  };

  const saveStack = async () => {
    await fetch("http://localhost:8003/workflow/save", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name: stackName, nodes, edges })
    });
    alert("Stack saved!");
  };

  const handlePdfUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:8003/pdf/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      // Update all knowledge base nodes with the uploaded PDF info
      setNodes((nds) =>
        nds.map((n) => 
          n.type === "knowledgeBase" 
            ? { 
                ...n, 
                data: { 
                  ...n.data, 
                  filename: data.filename,
                  chunks: data.chunks,
                  text: data.preview
                } 
              } 
            : n
        )
      );
      
      alert(`PDF uploaded with ${data.chunks} chunks`);
    } catch (error) {
      alert("PDF upload failed");
    }
  };

  const updateNode = (nodeId, newData) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === nodeId ? { ...n, data: newData } : n))
    );
  };

  const openChat = () => {
    const error = validateWorkflow(nodes, edges);
    if (error) return alert(error);
    setChatOpen(true);
  };

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-white">
        <TopBar onChat={openChat} onSave={saveStack} />

        <div className="flex flex-1">
          <Sidebar onPdfUpload={handlePdfUpload} />
          <FlowCanvas
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            onNodeClick={setSelectedNode}
          />
          <ComponentConfig
            selectedNode={selectedNode}
            onUpdateNode={updateNode}
          />
        </div>

        <ChatModal
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          workflow={{ nodes, edges }}
          stackId={id}
        />
      </div>
    </ReactFlowProvider>
  );
}
