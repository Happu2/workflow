# AI Workflow Builder

A no-code/low-code web application for creating intelligent workflows using drag-and-drop components.

## Features

- Visual workflow builder with React Flow
- Components: User Query, Knowledge Base, Web Search, LLM (OpenAI/Gemini), Output
- PDF upload and text extraction
- Vector search with ChromaDB
- Streaming chat interface
- Workflow persistence with PostgreSQL
- User authentication and authorization
- Execution logs and monitoring
- Docker and Kubernetes deployment support

## Tech Stack

- Frontend: React.js, React Flow, TailwindCSS
- Backend: FastAPI, Python
- Database: PostgreSQL
- Vector Store: ChromaDB
- Embeddings: OpenAI Embeddings
- LLMs: OpenAI GPT-4, Gemini
- Web Search: SerpAPI
- Containerization: Docker
- Orchestration: Kubernetes
- Monitoring: Prometheus, Grafana

## Quick Start

### Docker Compose (Recommended)

1. Clone the repository and navigate to the project directory
2. Copy environment file: `cp backend/.env.example backend/.env`
3. Edit `backend/.env` with your API keys (see below for required keys)
4. Do not mount `./backend:/app` as a volume in docker-compose.yml (this will break .env loading)
5. Run: `docker-compose up --build`
6. Access the application at http://localhost:5175

### Manual Setup

#### Prerequisites
- Node.js 18+
- Python 3.8+
- PostgreSQL
- API keys for OpenAI, Gemini, SerpAPI

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
# Update .env with your API keys
uvicorn main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Deployment

### Docker Deployment

#### Using Docker Compose
```bash
# Build and run all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop services
docker-compose down
```

#### Manual Docker Build
```bash
# Build images
docker build -t ai-workflow-backend ./backend
docker build -t ai-workflow-frontend ./frontend

# Run containers
docker run -p 8003:8003 ai-workflow-backend
docker run -p 5175:5175 ai-workflow-frontend
```

### Kubernetes Deployment

1. Ensure you have a Kubernetes cluster running
2. Apply the configurations:
```bash
kubectl apply -f k8s/config.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/chromadb.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

3. For monitoring (optional):
```bash
kubectl apply -f monitoring/prometheus.yaml
kubectl apply -f monitoring/grafana.yaml
```

4. Update your `/etc/hosts` file:
```
127.0.0.1 app.localhost api.localhost grafana.localhost prometheus.localhost
```

5. Access the application:
- Frontend: http://app.localhost
- Backend API: http://api.localhost
- Grafana: http://grafana.localhost (admin/admin)
- Prometheus: http://prometheus.localhost

## Usage

1. **Register/Login**: Create an account or login
2. **Create Stack**: Click "Create New Stack" from dashboard
3. **Build Workflow**: Drag components onto canvas and connect them
4. **Configure Components**:
   - Upload PDFs to Knowledge Base
   - Set LLM model and parameters
   - Configure web search if needed
5. **Save Stack**: Save your workflow configuration
6. **Chat**: Click "Chat with Stack" to interact with your AI workflow

## API Documentation

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Workflows
- `GET /workflow/stacks` - List user stacks
- `GET /workflow/stack/{id}` - Get stack details
- `POST /workflow/save` - Save/update stack

### Chat & Processing
- `POST /chat/stream` - Stream chat responses
- `POST /pdf/upload` - Upload PDF documents

### Monitoring
- `GET /logs/stack/{stack_id}` - Get execution logs
- `GET /logs/all` - Get all execution logs
- `GET /health` - Health check

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed system architecture and data flow diagrams.

## Configuration

### Environment Variables
```
# Place this file as backend/.env (not in the root directory)
# Docker Compose will load it automatically for the backend service
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
SERP_API_KEY=your_serpapi_key

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# JWT Security
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

For the frontend, only add a frontend/.env if you need to expose keys to the browser (must use VITE_ prefix, e.g. VITE_GEMINI_API_KEY).

## Development

### Project Structure
```
├── backend/                 # FastAPI backend
│   ├── api/                # API endpoints
│   ├── db/                 # Database models
│   └── main.py            # Application entry point
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── contexts/      # React contexts
├── k8s/                   # Kubernetes manifests
├── monitoring/            # Prometheus/Grafana configs
└── docker-compose.yml     # Docker Compose setup
```

### Running Tests
```bash
# Backend tests
cd backend && python -m pytest

# Frontend tests
cd frontend && npm test
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env
   - Verify database exists: `createdb genai`

2. **API Key Errors**
   - Verify API keys in backend/.env
   - Do not mount `./backend:/app` as a volume in docker-compose.yml (this will overwrite the .env file)
   - Check API key validity and quotas

3. **CORS Errors**
   - Backend automatically handles CORS for frontend
   - Ensure frontend is running on configured port

4. **Vector Store Issues**
   - ChromaDB should start automatically with docker-compose
   - Check logs: `docker-compose logs chromadb`

### Logs
```bash
# Docker Compose logs
docker-compose logs -f

# Kubernetes logs
kubectl logs -f deployment/backend
kubectl logs -f deployment/frontend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details