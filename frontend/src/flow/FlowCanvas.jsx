import { useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

import KnowledgeBaseNode from "../nodes/KnowledgeBaseNode";
import UserQueryNode from "../nodes/UserQueryNode";
import LLMNode from "../nodes/LLMNode";
import OutputNode from "../nodes/OutputNode";
import WebSearchNode from "../nodes/WebSearchNode";

const nodeTypes = {
  knowledgeBase: KnowledgeBaseNode,
  userQuery: UserQueryNode,
  llm: LLMNode,
  output: OutputNode,
  webSearch: WebSearchNode,
};

let id = 0;
const getId = () => `node_${id++}`;

function CanvasInner({ nodes, setNodes, edges, setEdges, onNodeClick }) {
  const { project } = useReactFlow();

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  // ✅ THIS WAS THE MISSING PIECE
  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();

      const type = e.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = project({
        x: e.clientX,
        y: e.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: {},
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project, setNodes]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}   // ✅ NOW WORKS
      onDrop={onDrop}
      onDragOver={onDragOver}
      onNodeClick={(_, node) => onNodeClick?.(node)}
      fitView
    />
  );
}

export default function FlowCanvas(props) {
  return (
    <div className="flex-1">
        <CanvasInner {...props} />

    </div>
  );
}
