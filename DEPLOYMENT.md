# AI Workflow Builder - Deployment Guide

## Overview
This guide provides instructions for deploying the AI Workflow Builder application using Docker, Docker Compose, and Kubernetes.

## Prerequisites
- Docker and Docker Compose
- Kubernetes cluster (for K8s deployment)
- kubectl configured
- At least 4GB RAM, 2 CPU cores recommended

## Quick Start with Docker Compose

### 1. Environment Setup
```bash
# Clone the repository
cd /path/to/ai-workflow-builder

# Create environment file
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys
```

### 2. Build and Run
```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 3. Access the Application
- Frontend: http://localhost:5175
- Backend API: http://localhost:8003
- ChromaDB: http://localhost:8000
- PostgreSQL: localhost:5432

### 4. Stop Services
```bash
docker-compose down
```

## Kubernetes Deployment

### 1. Prerequisites
- Kubernetes cluster (minikube, k3s, or cloud provider)
- kubectl configured
- NGINX Ingress Controller installed

### 2. Deploy to Kubernetes
```bash
# Apply configurations in order
kubectl apply -f k8s/config.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/chromadb.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml

# For monitoring (optional)
kubectl apply -f monitoring/prometheus.yaml
kubectl apply -f monitoring/grafana.yaml
```

### 3. Build and Push Images
```bash
# Build images
docker build -t ai-workflow-backend:latest ./backend
docker build -t ai-workflow-frontend:latest ./frontend

# Push to registry (if using external registry)
docker tag ai-workflow-backend:latest your-registry/ai-workflow-backend:latest
docker tag ai-workflow-frontend:latest your-registry/ai-workflow-frontend:latest
docker push your-registry/ai-workflow-backend:latest
docker push your-registry/ai-workflow-frontend:latest
```

### 4. Update Ingress (Optional)
Update your `/etc/hosts` file:
```
127.0.0.1 app.localhost
127.0.0.1 api.localhost
127.0.0.1 grafana.localhost
127.0.0.1 prometheus.localhost
```

### 5. Access the Application
- Frontend: http://app.localhost
- Backend API: http://api.localhost
- Grafana: http://grafana.localhost (admin/admin)
- Prometheus: http://prometheus.localhost

## Monitoring Setup

### Prometheus Metrics
The application exposes metrics at:
- Backend: `/metrics` endpoint
- Frontend: `/metrics` endpoint (if implemented)

### Grafana Dashboards
1. Access Grafana at http://grafana.localhost
2. Login with admin/admin
3. Add Prometheus as data source: http://prometheus-service:9090
4. Import dashboards for application monitoring

## Configuration

### Environment Variables
```bash
# Backend (.env)
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
SERP_API_KEY=your_serpapi_key
DATABASE_URL=postgresql://user:pass@host:5432/db

# Frontend
VITE_API_BASE_URL=http://localhost:8003
```

### Scaling
```bash
# Scale backend replicas
kubectl scale deployment backend --replicas=3

# Scale frontend replicas
kubectl scale deployment frontend --replicas=2
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check PostgreSQL pod
   kubectl logs -f deployment/postgres

   # Check database connectivity
   kubectl exec -it deployment/postgres -- psql -U postgres -d genai
   ```

2. **Backend Not Starting**
   ```bash
   # Check backend logs
   kubectl logs -f deployment/backend

   # Check service endpoints
   kubectl get endpoints
   ```

3. **Frontend Not Loading**
   ```bash
   # Check frontend logs
   kubectl logs -f deployment/frontend

   # Verify ingress
   kubectl describe ingress frontend-ingress
   ```

### Logs and Debugging
```bash
# View all pods
kubectl get pods

# View logs
kubectl logs -f deployment/backend
kubectl logs -f deployment/frontend

# Check services
kubectl get services

# Check ingress
kubectl get ingress
```

## Production Considerations

1. **Security**
   - Use secrets for API keys
   - Enable HTTPS with TLS certificates
   - Configure proper RBAC

2. **Monitoring**
   - Set up alerts for key metrics
   - Configure log aggregation
   - Monitor resource usage

3. **Backup**
   - Regular database backups
   - Persistent volume snapshots
   - Configuration backups

4. **Scaling**
   - Horizontal Pod Autoscaling
   - Load balancer configuration
   - CDN for static assets

## Cleanup

### Docker Compose
```bash
docker-compose down -v
```

### Kubernetes
```bash
kubectl delete -f k8s/
kubectl delete -f monitoring/
kubectl delete pvc --all
```