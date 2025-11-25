# 🚀 Vercel Deployment Guide - Client & Server Terpisah

## 📋 Overview

Deploy **Client** dan **Server** sebagai 2 project terpisah di Vercel.

**Architecture:**
```
┌──────────────────────┐
│  Vercel - Frontend   │ ← React + Vite
│  ayadesignstore.vercel.app
└──────────┬───────────┘
           │ API calls
           ↓
┌──────────────────────┐
│  Vercel - Backend    │ ← Express + MongoDB (Serverless)
│  ayadesign-api.vercel.app
└──────────────────────┘
```

---

## ⚙️ Pre-Setup

### 1. Install Vercel CLI

```powershell
npm install -g vercel
```

### 2. Login ke Vercel

```powershell
vercel login
```

---

## 🎯 Part 1: Deploy Backend (Server)

### Step 1: Deploy Server ke Vercel

```powershell
# Dari root project
vercel --prod --name ayadesign-api
```

**Saat ditanya:**
- `Set up and deploy?` → **Y**
- `Which scope?` → Pilih account Anda
- `Link to existing project?` → **N**
- `What's your project's name?` → **ayadesign-api**
- `In which directory is your code located?` → **./server**
- `Want to override settings?` → **Y**
- `Output directory?` → (leave blank, press Enter)

### Step 2: Set Environment Variables di Vercel

**Via Vercel CLI:**

```powershell
# Set MongoDB URI
vercel env add MONGO_URI production
# Paste: mongodb+srv://irfnriza:monggoCorn123@cluster0.qib5njk.mongodb.net/ayadesign

# Set JWT Secret
vercel env add JWT_SECRET production
# Paste: your-super-secret-jwt-key-change-this-in-production

# Set Node Environment
vercel env add NODE_ENV production
# Paste: production

# Set Cloudinary Name
vercel env add CLOUDINARY_CLOUD_NAME production
# Paste: demojxe5h

# Set Cloudinary API Key
vercel env add CLOUDINARY_API_KEY production
# Paste: 937534769771837

# Set Cloudinary API Secret
vercel env add CLOUDINARY_API_SECRET production
# Paste: MZvjLwcAikE-RmjRAsp_udEiVX4

# Set Frontend URL (update setelah deploy client)
vercel env add FRONTEND_URL production
# Paste: https://ayadesignstore.vercel.appl.app
```

**Atau Via Vercel Dashboard:**

1. Buka https://vercel.com/dashboard
2. Pilih project **ayadesign-api**
3. Go to **Settings** → **Environment Variables**
4. Tambahkan satu per satu:

| Key | Value |
|-----|-------|
| `MONGO_URI` | `mongodb+srv://irfnriza:monggoCorn123@cluster0.qib5njk.mongodb.net/ayadesign` |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this-in-production` |
| `NODE_ENV` | `production` |
| `CLOUDINARY_CLOUD_NAME` | `demojxe5h` |
| `CLOUDINARY_API_KEY` | `937534769771837` |
| `CLOUDINARY_API_SECRET` | `MZvjLwcAikE-RmjRAsp_udEiVX4` |
| `FRONTEND_URL` | `https://ayadesignstore.vercel.app` |

### Step 3: Redeploy After Adding Environment Variables

```powershell
vercel --prod
```

**Your Backend URL:** `https://ayadesign-api.vercel.app`

---

## 🎯 Part 2: Deploy Frontend (Client)

### Step 1: Update Client Environment Variable

Edit `client/.env.production`:

```env
VITE_BASE_URL=https://ayadesign-api.vercel.app
```

### Step 2: Update Vite Config (jika belum)

Edit `client/vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_BASE_URL || 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
```

### Step 3: Deploy Client ke Vercel

```powershell
# Dari root project
vercel --prod --name ayadesign
```

**Saat ditanya:**
- `Set up and deploy?` → **Y**
- `Which scope?` → Pilih account Anda
- `Link to existing project?` → **N**
- `What's your project's name?` → **ayadesign**
- `In which directory is your code located?` → **./client**
- `Want to override settings?` → **Y**
- `Build command?` → **npm run build**
- `Output directory?` → **dist**
- `Development command?` → **npm run dev**

**Your Frontend URL:** `https://ayadesign.vercel.app`

---

## 🔄 Update Backend CORS

Setelah dapat URL frontend, update `server/index.js`:

```javascript
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'https://ayadesignstore.vercel.app', // ← URL frontend Anda
        'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Redeploy backend:

```powershell
vercel --prod
```

---

## 📝 Alternative: Deploy via GitHub (Recommended)

### Backend (Server)

1. **Push ke GitHub**
   ```powershell
   git add .
   git commit -m "Setup Vercel backend deployment"
   git push origin main
   ```

2. **Connect ke Vercel:**
   - Buka https://vercel.com/new
   - Import repository **irfnriza/ayadesign-POPL-16**
   - **Project Name:** `ayadesign-api`
   - **Root Directory:** `server`
   - **Framework Preset:** Other
   - **Build Command:** (leave blank)
   - **Output Directory:** (leave blank)
   - **Install Command:** `npm install`

3. **Add Environment Variables** (sama seperti di atas)

4. **Deploy!**

### Frontend (Client)

1. **Update .env.production dengan backend URL**
   
2. **Connect ke Vercel:**
   - Buka https://vercel.com/new
   - Import repository **irfnriza/ayadesign-POPL-16** (lagi)
   - **Project Name:** `ayadesign`
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Add Environment Variables:**
   ```
   VITE_BASE_URL=https://ayadesign-api.vercel.app
   ```

4. **Deploy!**

---

## ✅ Verification Checklist

### Backend Checks:

```powershell
# Test health endpoint
curl https://ayadesign-api.vercel.app/

# Test auth endpoint
curl https://ayadesign-api.vercel.app/auth/test
```

### Frontend Checks:

1. Buka https://ayadesignstore.vercel.app
2. Coba login
3. Check browser console (F12) untuk API calls
4. Pastikan tidak ada CORS errors

---

## 🔧 Troubleshooting

### Issue: CORS Error

**Fix:** Update `FRONTEND_URL` di environment variables backend, lalu redeploy.

```powershell
vercel env add FRONTEND_URL production
# Enter: https://ayadesignstore.vercel.app (URL frontend aktual)

vercel --prod
```

### Issue: API 404 Error

**Check:**
1. Apakah `VITE_BASE_URL` di client sudah benar?
2. Apakah backend deploy sukses?
3. Check logs: `vercel logs <deployment-url>`

### Issue: Environment Variables tidak terbaca

**Fix:** Redeploy setelah menambah env vars.

```powershell
vercel --prod
```

---

## 📊 Deployment URLs

Setelah selesai, Anda akan punya:

- **Frontend:** https://ayadesignstore.vercel.app
- **Backend API:** https://ayadesign-api.vercel.app
- **Auto-deploy dari GitHub:** Setiap push ke `main` branch

---

## 🎯 Quick Commands Reference

```powershell
# Deploy backend
vercel --prod --name ayadesign-api

# Deploy frontend
vercel --prod --name ayadesign

# View logs
vercel logs ayadesign-api.vercel.app

# List deployments
vercel ls

# Remove deployment
vercel rm <deployment-name>

# Add environment variable
vercel env add <KEY> production
```

---

## 🔒 Security Notes

1. **Jangan commit `.env.production`** ke GitHub
2. **JWT_SECRET:** Ganti dengan value yang lebih secure untuk production
3. **MongoDB:** Gunakan MongoDB Atlas Network Access whitelist (tambahkan `0.0.0.0/0` untuk Vercel)
4. **Cloudinary:** Consider rotating API keys secara berkala

---

## 🚀 Next Steps

1. Setup custom domain (opsional)
2. Enable Vercel Analytics
3. Setup monitoring & logging
4. Configure CI/CD dengan GitHub Actions

**Selamat! Aplikasi Anda sekarang live di Vercel! 🎉**
