# Amazon DevClone – Full Stack CI/CD Kubernetes Deployment

![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue?logo=githubactions)
![Docker](https://img.shields.io/badge/Container-Docker-2496ED?logo=docker)
![Kubernetes](https://img.shields.io/badge/Orchestration-Kubernetes-326CE5?logo=kubernetes)
![AWS](https://img.shields.io/badge/Cloud-AWS%20EC2-FF9900?logo=amazonaws)

---

## Project Overview

This project demonstrates a **production-style CI/CD pipeline** for a full-stack Amazon clone application. The app is built with a React/Vite frontend, a Node.js + Express backend, and a MySQL database — all containerized using Docker.

On every push to the `main` branch, GitHub Actions automatically builds and pushes updated Docker images to DockerHub. The updated manifests are then deployed to a **Kubernetes cluster running on AWS EC2 using Kind (Kubernetes in Docker)**, simulating a real-world DevOps workflow without the cost of managed Kubernetes services like EKS.

The project covers the full DevOps lifecycle: local development → containerization → CI/CD automation → cloud deployment → Kubernetes orchestration.

---

## Architecture

```
User (Browser)
      ↓
EC2 Public IP
      ↓
Kind hostPort Mapping (extraPortMappings)
      ↓
Kubernetes NodePort Service
      ↓
Frontend Pod (React → Nginx, Port 80)
      ↓  (API calls via /api)
Backend Pod (Node.js + Express, Port 5000)
      ↓
MySQL Pod (Port 3306)
      ↓
Persistent Volume Claim (Data Persistence)
```

**Key infrastructure details:**
- All resources live inside a dedicated Kubernetes **namespace** for isolation
- Each service runs as a **Deployment** with configurable replica counts
- The frontend is exposed via a **NodePort service** (Kind does not support LoadBalancer natively)
- MySQL data is stored on a **Persistent Volume** so data survives pod restarts
- Kind's `extraPortMappings` bridges EC2 host ports to Kubernetes NodePorts

---

## Tech Stack

### Frontend
- React + Vite
- Nginx (serves the production build inside the container)

### Backend
- Node.js
- Express
- Sequelize ORM
- JWT Authentication

### Database
- MySQL
- Kubernetes Persistent Volume + Persistent Volume Claim

### DevOps
- Docker + DockerHub
- GitHub Actions (CI/CD)
- Kubernetes
- Kind (Kubernetes in Docker)
- AWS EC2 (Ubuntu)

---

## CI/CD Pipeline

Every push to the `main` branch triggers the following automated workflow:

```
1. Developer pushes code → main branch
2. GitHub Actions workflow is triggered
3. Docker builds fresh images for Frontend and Backend
4. Images are tagged and pushed to DockerHub
5. Kubernetes manifests are copied to EC2 via SSH (scp)
6. kubectl apply runs on EC2 to update Deployments
7. Pods are rolled out with the new image versions
```

**Important implementation details:**

- **Secrets management:** DockerHub credentials, EC2 SSH key, and host IP are stored as GitHub repository secrets — never hardcoded in workflows.
- **DockerHub auth:** The workflow uses `docker/login-action` to authenticate before push.
- **Image tagging:** Images are tagged with `latest` and optionally with the commit SHA to allow rollback and traceability.

---

## Kubernetes Setup

### Namespace
A dedicated namespace is created first to isolate all project resources:
```bash
kubectl create namespace amazon-devclone
```

### Deployments
Each service (frontend, backend, MySQL) has its own Deployment manifest with defined replica counts, resource limits, and environment variables injected via ConfigMaps/Secrets.

### Services
| Service   | Type        | Purpose                              |
|-----------|-------------|--------------------------------------|
| Frontend  | NodePort    | Exposes the app to EC2 host          |
| Backend   | ClusterIP   | Internal communication only          |
| MySQL     | ClusterIP   | Internal database access only        |

The frontend uses **NodePort** because Kind does not support the `LoadBalancer` service type without additional tooling like MetalLB.

### Persistent Volume (MySQL)
MySQL uses a `PersistentVolumeClaim` so that database data is not lost when the pod restarts. The PV is provisioned using Kind's default local storage class.

### Kind Port Mapping
The `kind-config.yaml` includes `extraPortMappings` to forward EC2 host ports to Kubernetes NodePorts:
```yaml
extraPortMappings:
  - containerPort: 30080
    hostPort: 80
    protocol: TCP
```
This is what makes the app accessible via the EC2 public IP.

---

## Port Reference

| Layer             | Port  | Description                                     |
|-------------------|-------|-------------------------------------------------|
| Nginx (container) | 80    | Serves the React production build               |
| Backend (container) | 5000 | Express API server                             |
| MySQL (container) | 3306  | Database                                        |
| NodePort          | 30080 | Kubernetes exposes frontend on this node port   |
| Kind hostPort     | 80    | EC2 host forwards port 80 → NodePort 30080      |
| EC2 Security Group| 80    | Inbound rule to allow public HTTP access        |

Understanding the full chain — `containerPort → targetPort → nodePort → hostPort → EC2 SG` — is critical for debugging connectivity issues.

---

## Challenges & Debugging Experience

Real-world issues encountered and resolved during this project:

| Challenge | Root Cause | Resolution |
|-----------|------------|------------|
| `ImagePullBackOff` error on pods | DockerHub image name had wrong username prefix | Corrected image reference in deployment YAML to match exact DockerHub repo path |
| Node.js `ERR_REQUIRE_ESM` crash | `uuid` v9+ is ESM-only, incompatible with CommonJS `require()` | Downgraded `uuid` to v7 which supports CommonJS |
| Pods stuck in `Pending` state | Namespace did not exist when manifests were applied | Added namespace creation as the first step in the deploy script |
| Frontend showing blank page | Vite dev server port (5173) was used instead of Nginx port (80) in the service config | Updated `targetPort` to 80 to match the Nginx container |
| App unreachable via EC2 IP | Kind `extraPortMappings` was missing from cluster config | Recreated Kind cluster with correct port mapping configuration |
| GitHub Actions SSH failure | EC2 key stored with wrong formatting in GitHub Secret | Re-added the PEM key ensuring no trailing whitespace or line breaks were lost |
| YAML apply partially failing | Indentation errors in multi-document YAML manifest | Used `kubectl apply --dry-run=client` to validate before applying |

> Anyone can follow a tutorial. Debugging production-like failures is where real DevOps learning happens.

---

## Running Locally

### Prerequisites
- Docker Desktop
- Node.js v18+
- kubectl
- Kind

### Backend
```bash
cd backend
npm install
cp .env.example .env   # Fill in DB credentials
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev            # Development server on http://localhost:5173
```

### Docker Build & Run
```bash
# Backend
docker build -t your-dockerhub-username/amazon-backend ./backend
docker run -p 5000:5000 your-dockerhub-username/amazon-backend

# Frontend
docker build -t your-dockerhub-username/amazon-frontend ./frontend
docker run -p 80:80 your-dockerhub-username/amazon-frontend
```

### Kubernetes Deployment (Kind)
```bash
# Create Kind cluster with port mappings
kind create cluster --config kind-config.yaml

# Create namespace
kubectl create namespace amazon-devclone

# Apply all manifests
kubectl apply -f k8s/

# Verify pods are running
kubectl get pods -n amazon-devclone
```

The app will be available at `http://localhost` once all pods reach `Running` status.

---

## Future Improvements

This project intentionally mirrors a real DevOps pipeline. Planned enhancements to move it closer to production-grade:

- **Ingress Controller** – Replace NodePort with an Nginx Ingress for cleaner routing and path-based rules
- **AWS EKS Migration** – Move from Kind on EC2 to a managed EKS cluster for true cloud-native deployment
- **Helm Charts** – Package all Kubernetes manifests into a Helm chart for environment-specific value overrides
- **Monitoring Stack** – Add Prometheus + Grafana for metrics collection and dashboard visualization
- **HTTPS / TLS** – Integrate cert-manager with Let's Encrypt for automatic SSL certificate provisioning
- **Staging Environment** – Set up a separate namespace or cluster as a staging environment with branch-based deployments
- **Database Migrations** – Automate schema migrations using Sequelize CLI in the CI/CD pipeline
- **Horizontal Pod Autoscaler** – Configure HPA rules to scale pods based on CPU/memory usage

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## License

[MIT](LICENSE)
