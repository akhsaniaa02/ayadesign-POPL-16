# 🚀 Deploy ke Fly.io - Complete Guide

## 📋 Setup (5 Menit)

### Step 1: Install Fly CLI

**Windows (PowerShell):**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**macOS/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

### Step 2: Login & Create App

```bash
# Login ke Fly.io
fly auth login

# Create app (one-time)
fly apps create ayadesign-popl-16 --org personal

# Atau gunakan nama lain jika sudah terpakai:
# fly apps create ayadesign-popl-16-<yourname>
```

### Step 3: Set Environment Variables (Secrets)

```bash
# Set MongoDB URI
fly secrets set MONGO_URI="mongodb+srv://irfnriza:monggoCorn123@cluster0.qib5njk.mongodb.net/ayadesign"

# Set JWT Secret
fly secrets set JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Set Cloudinary credentials
fly secrets set CLOUDINARY_CLOUD_NAME="demojxe5h"
fly secrets set CLOUDINARY_API_KEY="937534769771837"
fly secrets set CLOUDINARY_API_SECRET="MZvjLwcAikE-RmjRAsp_udEiVX4"

# Verify secrets
fly secrets list
```

### Step 4: Create Volume for Uploads (Optional)

```bash
# Create persistent volume
fly volumes create uploads_data --size 1 --region sin

# List volumes
fly volumes list
```

### Step 5: Deploy!

```bash
# Deploy aplikasi
fly deploy

# Monitor deployment
fly logs
```

---

## 🔄 Deploy via GitHub Actions (Automated)

### Setup GitHub Secrets

1. Get Fly.io API Token:
```bash
fly auth token
```

2. Add to GitHub:
   - Go to: **Repository → Settings → Secrets → Actions**
   - Click: **New repository secret**
   - Name: `FLY_API_TOKEN`
   - Value: `<paste-token-from-step-1>`

### Auto Deploy

Setelah setup, setiap push ke `main` akan otomatis deploy:

```bash
git add .
git commit -m "feat: new feature"
git push origin main
# GitHub Actions akan auto deploy ke Fly.io!
```

---

## 🌐 Access Application

### URLs
- **Frontend:** https://ayadesign-popl-16.fly.dev
- **Backend API:** https://ayadesign-popl-16.fly.dev:3001

### Custom Domain (Optional)

```bash
# Add custom domain
fly certs create yourdomain.com

# Check certificate status
fly certs show yourdomain.com

# Update DNS (add CNAME):
# yourdomain.com → ayadesign-popl-16.fly.dev
```

---

## 📊 Monitoring & Management

### View Logs
```bash
# Real-time logs
fly logs

# Last 100 lines
fly logs --lines 100
```

### Check Status
```bash
# App status
fly status

# VM instances
fly vm status

# Resource usage
fly vm list
```

### Scale Application
```bash
# Scale VM size
fly scale vm shared-cpu-1x --memory 1024

# Scale instances
fly scale count 2

# Auto-scale configuration
fly autoscale set min=1 max=3
```

### SSH into Container
```bash
# SSH to running instance
fly ssh console

# Run commands
fly ssh console -C "node -v"
fly ssh console -C "ls -la /app"
```

---

## 🔧 Configuration Details

### fly.toml Explained

```toml
app = "ayadesign-popl-16"          # App name
primary_region = "sin"             # Singapore region

[build]
  dockerfile = "Dockerfile"        # Use existing Dockerfile

[env]
  PORT = "3001"                    # Backend port

[http_service]
  internal_port = 5173             # Frontend port (Vite)
  force_https = true               # Always use HTTPS
  auto_stop_machines = true        # Stop when idle
  auto_start_machines = true       # Start on request
  min_machines_running = 1         # Keep 1 instance running

[mounts]
  source = "uploads_data"          # Persistent storage
  destination = "/app/server/uploads"
  initial_size = "1gb"
```

### Available Regions

```bash
# List all regions
fly platform regions

# Common regions:
# sin - Singapore (recommended untuk Indonesia)
# nrt - Tokyo
# hkg - Hong Kong
# syd - Sydney
# ams - Amsterdam
# lhr - London
# iad - US East
```

---

## 💰 Pricing

### Free Tier (Hobby Plan)
- ✅ 3 shared-cpu-1x VMs (256MB RAM)
- ✅ 3GB persistent storage
- ✅ 160GB outbound data transfer
- ✅ Custom domains dengan SSL

### Your App Requirements
- **1 VM** (shared-cpu-1x, 512MB) = **Free** ✅
- **1GB volume** = **Free** ✅
- **Bandwidth** = Free untuk < 160GB/month

**Total: $0/month** untuk moderate traffic! 🎉

---

## 🔄 Update & Rollback

### Deploy Update
```bash
# Deploy latest changes
fly deploy

# Deploy specific version
fly deploy --image <username>/team16-popl:v1.0.0
```

### Rollback
```bash
# List releases
fly releases

# Rollback to previous version
fly releases rollback

# Rollback to specific version
fly releases rollback v42
```

### Zero-Downtime Deployment
```bash
# Deploy with health checks
fly deploy --strategy rolling

# Deploy with canary (10% traffic first)
fly deploy --strategy canary
```

---

## 🐛 Troubleshooting

### App Won't Start
```bash
# Check logs
fly logs

# Common issues:
# 1. Missing secrets
fly secrets list

# 2. Port mismatch - verify Dockerfile EXPOSE
# 3. Health check failing - check /health endpoint
```

### MongoDB Connection Issues
```bash
# Verify MONGO_URI secret
fly secrets list

# Check if MongoDB Atlas allows Fly.io IPs
# Go to MongoDB Atlas → Network Access → Add IP: 0.0.0.0/0
```

### Out of Memory
```bash
# Scale up memory
fly scale vm shared-cpu-1x --memory 1024

# Or upgrade to dedicated CPU
fly scale vm dedicated-cpu-1x --memory 2048
```

### Certificate Issues
```bash
# Check certificate
fly certs check yourdomain.com

# Recreate certificate
fly certs remove yourdomain.com
fly certs create yourdomain.com
```

---

## 🎯 Architecture: Monolith vs Microservices

### Current Setup (Monolith) ✅
```
┌─────────────────────────────┐
│   Fly.io VM Instance        │
│  ┌─────────┐  ┌──────────┐ │
│  │ Vite    │  │ Express  │ │
│  │ :5173   │  │ :3001    │ │
│  └─────────┘  └──────────┘ │
│                             │
│  Single Container           │
└─────────────────────────────┘
```

**Pro:** Simple, cheap, adequate untuk project ini

### Alternative: Microservices (Advanced)

Jika butuh scale frontend & backend terpisah:

**Backend Dockerfile** (server/Dockerfile):
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "index.js"]
```

**Frontend Dockerfile** (client/Dockerfile):
```dockerfile
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Deploy:**
```bash
# Backend
cd server
fly launch --name ayadesign-backend --region sin
fly secrets set MONGO_URI=... JWT_SECRET=... CLOUDINARY_...
fly deploy

# Frontend  
cd ../client
fly launch --name ayadesign-frontend --region sin
# Update .env untuk point ke backend:
# VITE_BASE_URL=https://ayadesign-backend.fly.dev
fly deploy
```

**Tapi untuk project Anda, monolith sudah cukup!** ⭐

---

## ✅ Deployment Checklist

Pre-deployment:
- [ ] Fly CLI installed
- [ ] Logged in: `fly auth login`
- [ ] App created: `fly apps create`
- [ ] Secrets configured: `fly secrets set ...`
- [ ] Volume created (optional): `fly volumes create`

Deployment:
- [ ] fly.toml configured
- [ ] `fly deploy` successful
- [ ] App accessible at https://[app-name].fly.dev
- [ ] Logs normal: `fly logs`

GitHub Actions (optional):
- [ ] FLY_API_TOKEN added to GitHub Secrets
- [ ] Workflow file committed
- [ ] Auto-deploy on push working

---

## 🚀 Quick Commands Cheat Sheet

```bash
# Setup
fly auth login                    # Login
fly apps create <name>           # Create app
fly secrets set KEY=value        # Set environment variable

# Deploy
fly deploy                       # Deploy app
fly deploy --remote-only         # Build on Fly.io servers

# Monitor
fly logs                         # View logs
fly status                       # App status
fly vm status                    # VM status

# Scale
fly scale vm shared-cpu-1x --memory 512    # Scale VM
fly scale count 2                          # Scale instances

# Manage
fly ssh console                  # SSH into container
fly secrets list                 # List secrets
fly releases                     # List releases
fly releases rollback            # Rollback

# Cleanup
fly apps destroy <name>          # Delete app
fly volumes delete <id>          # Delete volume
```

---

## 📝 Summary

**Untuk project Anda, gunakan Option 1 (Monolith):**

1. ✅ Deploy sebagai 1 service (sudah configure di fly.toml)
2. ✅ Hemat biaya (free tier cukup)
3. ✅ Setup simple (sudah siap)
4. ✅ Auto-deploy via GitHub Actions (optional)

**Steps:**
```bash
# 1. Setup
fly auth login
fly apps create ayadesign-popl-16

# 2. Configure secrets
fly secrets set MONGO_URI="..." JWT_SECRET="..." CLOUDINARY_...

# 3. Deploy
fly deploy

# 4. Access
# https://ayadesign-popl-16.fly.dev
```

**Deploy via GitHub (automated):**
1. Add `FLY_API_TOKEN` to GitHub Secrets
2. Push to main → auto deploy!

---

**Ready to deploy! 🎉**
