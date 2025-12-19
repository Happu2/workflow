# AI Workflow Builder - Architecture Diagram
# ===========================================

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React.js)    │◄──►│   (FastAPI)     │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ - React Flow    │    │ - Auth API      │    │ - Users         │
│ - Component     │    │ - Workflow API  │    │ - Stacks        │
│   Library       │    │ - Chat API      │    │ - Workflows     │
│ - Chat Modal    │    │ - PDF Processing│    │ - Chat Logs     │
│ - Auth Modal    │    │ - LLM Integration│    │ - Execution Logs│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   External      │    │   Vector Store  │    │   AI Services   │
│   Services      │    │   (ChromaDB)    │    │                 │
│                 │    │                 │    │ - OpenAI API    │
│ - SerpAPI       │    │ - Embeddings    │    │ - Gemini API    │
│   (Web Search)  │    │ - Vector Search │    │ - Embeddings    │
└─────────────────┘    └─────────────────┘    └─────────────────┘

## Data Flow

1. User builds workflow visually using React Flow
2. Workflow configuration saved to PostgreSQL
3. User uploads PDF → Backend processes with PyMuPDF
4. Text extracted → Embeddings generated via OpenAI/Gemini
5. Embeddings stored in ChromaDB vector store
6. User asks question → Query processed through workflow
7. Knowledge retrieved from ChromaDB if KnowledgeBase component used
8. LLM (OpenAI/Gemini) generates response, optionally using SerpAPI
9. Response displayed in chat interface
10. All interactions logged to PostgreSQL

## Component Architecture

### Frontend Components:
- App.jsx (Main app with routing)
- AuthContext.jsx (Authentication state)
- AuthModal.jsx (Login/Register)
- Stacks.jsx (Workflow list)
- StackBuilder.jsx (Workflow editor)
- FlowCanvas.jsx (React Flow canvas)
- ChatModal.jsx (Chat interface)
- Component library (UserQuery, KnowledgeBase, LLM, Output nodes)

### Backend API Structure:
- /auth/* (Authentication endpoints)
- /workflow/* (Workflow CRUD)
- /chat/* (Chat streaming)
- /pdf/* (PDF upload/processing)
- /logs/* (Execution logs)

### Database Schema:
- users (authentication)
- stacks (workflow containers)
- workflows (node/edge definitions)
- chat_logs (conversation history)
- execution_logs (workflow execution tracking)