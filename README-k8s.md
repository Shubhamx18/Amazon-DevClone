# Amazon Clone - Kubernetes Deployment

This directory contains Kubernetes manifests and Docker configuration for deploying the Amazon Clone application.

## 📁 Files Structure

```
k8s/
├── namespace.yaml           # Kubernetes namespace
├── configmap.yaml          # Environment variables
├── secret.yaml             # Sensitive data (DB password)
├── mysql-pvc.yaml          # Persistent volume for MySQL
├── mysql-deployment.yaml    # MySQL deployment and service
├── backend-deployment.yaml  # Backend deployment and service
├── frontend-deployment.yaml # Frontend deployment and service
├── ingress.yaml           # Ingress for external access
└── kustomization.yaml      # Kustomize configuration
```

## 🚀 Deployment Instructions

### Prerequisites
- Kubernetes cluster (minikube, EKS, GKE, etc.)
- kubectl configured
- Docker installed
- kustomize (optional, for easier deployment)

### Quick Deploy with Kustomize

```bash
# Apply all manifests
kubectl apply -k k8s/

# Check deployment status
kubectl get pods -n amazon-clone
kubectl get services -n amazon-clone
```

### Manual Deployment

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy MySQL
kubectl apply -f k8s/mysql-pvc.yaml
kubectl apply -f k8s/mysql-deployment.yaml

# Deploy Backend
kubectl apply -f k8s/backend-deployment.yaml

# Deploy Frontend
kubectl apply -f k8s/frontend-deployment.yaml

# Setup Ingress
kubectl apply -f k8s/ingress.yaml
```

## 🔧 Configuration

### Environment Variables
- `NODE_ENV`: Production environment
- `DB_HOST`: MySQL service hostname
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password (from secret)
- `JWT_SECRET`: JWT signing secret
- `FRONTEND_URL`: Frontend URL for CORS

### Services
- **MySQL**: Port 3306, ClusterIP
- **Backend**: Port 5000, ClusterIP
- **Frontend**: Port 80, LoadBalancer

### Storage
- MySQL uses 10Gi persistent volume
- Backend uploads are ephemeral (consider adding PVC for production)

## 🐳 Docker Development

### Build Images
```bash
# Backend
docker build -t amazon-clone-backend ./backend

# Frontend
docker build -t amazon-clone-frontend ./frontend
```

### Docker Compose (Local Development)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🌐 Access

Once deployed:
- **Frontend**: Available via LoadBalancer IP or Ingress host
- **Backend API**: `/api/*` paths proxied to backend service
- **MySQL**: Internal cluster access only

## 🔍 Monitoring

### Check Pod Status
```bash
kubectl get pods -n amazon-clone
kubectl describe pod <pod-name> -n amazon-clone
```

### View Logs
```bash
kubectl logs -f deployment/backend -n amazon-clone
kubectl logs -f deployment/frontend -n amazon-clone
kubectl logs -f deployment/mysql -n amazon-clone
```

### Scale Applications
```bash
# Scale backend
kubectl scale deployment backend --replicas=3 -n amazon-clone

# Scale frontend
kubectl scale deployment frontend --replicas=3 -n amazon-clone
```

## 🛠️ Troubleshooting

### Common Issues
1. **Image Pull Errors**: Ensure Docker images are built and pushed to registry
2. **Database Connection**: Check MySQL pod logs and secrets
3. **Frontend 404s**: Verify Ingress configuration
4. **Backend 500s**: Check environment variables and database connectivity

### Reset Deployment
```bash
# Delete all resources
kubectl delete namespace amazon-clone

# Redeploy
kubectl apply -k k8s/
```

## 🔐 Security Notes

- Database password is stored in Kubernetes Secret
- Use HTTPS in production (configure TLS in Ingress)
- Consider NetworkPolicies for additional security
- Regularly update base images for security patches
