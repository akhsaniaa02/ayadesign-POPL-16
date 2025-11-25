# GitHub Actions Workflows

Dokumentasi untuk automated workflows di repository ini.

## 🔄 Workflows

### 1. Docker Build and Push (`docker-build-push.yml`)

**Trigger:**
- Push ke branch `main` atau `develop`
- Push tag dengan pattern `v*` (e.g., v1.0.0)
- Pull request ke `main` atau `develop`
- Manual trigger via GitHub Actions UI

**Jobs:**
1. **Lint** - Code linting untuk server dan client
2. **Build and Push** - Build Docker image dan push ke Docker Hub
3. **Test Image** - Pull image dan test apakah berjalan dengan baik
4. **Notify** - Summary hasil workflow

**Environment Variables:**
- `DOCKER_IMAGE_NAME`: team16-popl
- `DOCKER_IMAGE_TAG`: submit-UTS

**Secrets Required:**
- `DOCKERHUB_USERNAME`: Username Docker Hub Anda
- `DOCKERHUB_TOKEN`: Access token Docker Hub

**Tags Generated:**
- `latest` (hanya dari branch main)
- `submit-UTS`
- Branch name (e.g., `main`, `develop`)
- Git SHA (e.g., `main-abc1234`)
- Semantic version jika push tag (e.g., `v1.0.0`, `1.0`)

### 2. Code Quality Checks (`code-quality.yml`)

**Trigger:**
- Push ke branch `main`, `develop`, atau branch dengan pattern `feat/**`
- Pull request ke `main` atau `develop`

**Jobs:**
1. **ESLint Server** - Linting kode backend
2. **ESLint Client** - Linting kode frontend
3. **Prettier Check** - Format checking
4. **Dependency Audit** - Security audit npm packages
5. **Summary** - Ringkasan hasil quality checks

---

## 🔧 Setup

### 1. Setup Docker Hub Credentials

1. Login ke [Docker Hub](https://hub.docker.com)
2. Buat Access Token:
   - Account Settings → Security → New Access Token
   - Name: `github-actions`
   - Access permissions: Read, Write, Delete
   - Copy token yang dihasilkan

3. Tambahkan Secrets di GitHub:
   - Go to: Repository → Settings → Secrets and variables → Actions
   - Click: **New repository secret**
   - Add:
     - `DOCKERHUB_USERNAME` = username Docker Hub Anda
     - `DOCKERHUB_TOKEN` = token yang sudah dibuat

### 2. Enable GitHub Actions

1. Go to: Repository → Settings → Actions → General
2. Set "Actions permissions" ke: **Allow all actions and reusable workflows**
3. Set "Workflow permissions" ke: **Read and write permissions**

### 3. First Run

Push code ke branch `main`:
```bash
git add .
git commit -m "Add GitHub Actions workflows"
git push origin main
```

Atau trigger manual:
1. Go to: Actions tab
2. Select "Docker Build and Push"
3. Click "Run workflow"

---

## 📋 Workflow Details

### Docker Build and Push Flow

```
┌─────────────┐
│   Trigger   │
│ (Push/PR)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Lint     │ ◄── Parallel: Server & Client
│   Code      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Build     │
│   Docker    │ ◄── Multi-platform: amd64, arm64
│   Image     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Push     │
│  to Docker  │ ◄── Multiple tags
│    Hub      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Test     │
│   Image     │ ◄── Pull & run container
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Notify    │
│  Summary    │
└─────────────┘
```

### Code Quality Flow

```
┌──────────────────┐
│     Trigger      │
│   (Push/PR)      │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│ Server │ │ Client │
│ ESLint │ │ ESLint │
└────────┘ └────────┘
    │         │
    └────┬────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│Prettier│ │  Dep   │
│ Check  │ │ Audit  │
└────────┘ └────────┘
    │         │
    └────┬────┘
         │
         ▼
    ┌────────┐
    │Summary │
    └────────┘
```

---

## 🎯 Usage Examples

### Automatic Build on Push

```bash
# Commit dan push ke main
git add .
git commit -m "feat: add new feature"
git push origin main

# Workflow akan otomatis:
# 1. Lint code
# 2. Build Docker image
# 3. Push ke Docker Hub dengan tag: latest, submit-UTS, main, main-<sha>
```

### Semantic Versioning

```bash
# Create dan push tag
git tag v1.0.0
git push origin v1.0.0

# Workflow akan build dengan tags:
# - v1.0.0
# - 1.0
# - submit-UTS
# - latest (jika dari main)
```

### Pull Request Check

```bash
# Buat PR dari feature branch ke main
git checkout -b feat/new-feature
git add .
git commit -m "feat: implement new feature"
git push origin feat/new-feature

# Buat PR di GitHub
# Workflow akan:
# 1. Run quality checks
# 2. Build Docker image
# 3. Test image
# 4. Report hasil di PR
```

---

## 📊 Monitoring

### View Workflow Status

1. Go to: **Actions** tab di repository
2. Select workflow yang ingin dilihat
3. Click pada run untuk melihat detail

### View Build Summary

Setiap workflow run akan membuat summary yang berisi:
- Status setiap job
- Docker image tags yang dibuat
- Pull command untuk menggunakan image
- Quality check results

### Docker Hub

Check images yang sudah di-push:
1. Login ke [Docker Hub](https://hub.docker.com)
2. Go to: Repositories → `<username>/team16-popl`
3. View available tags

---

## 🔍 Troubleshooting

### ❌ "Authentication failed" saat push ke Docker Hub

**Solution:**
1. Verify `DOCKERHUB_USERNAME` dan `DOCKERHUB_TOKEN` di GitHub Secrets
2. Pastikan token masih valid (tidak expired)
3. Regenerate token jika perlu

### ❌ Build failed - "npm ci" error

**Solution:**
1. Pastikan `package-lock.json` ada di repository
2. Commit `package-lock.json` jika belum ada:
   ```bash
   cd server && npm install
   cd ../client && npm install
   git add */package-lock.json
   git commit -m "Add package-lock.json"
   ```

### ❌ Lint warnings/errors

**Solution:**
Lint jobs menggunakan `continue-on-error: true`, jadi tidak akan fail workflow.
Untuk fix:
1. Jalankan lint local: `npm run lint`
2. Fix issues yang muncul
3. Commit dan push

### ❌ Test image failed

**Solution:**
1. Check logs untuk error detail
2. Test image locally:
   ```bash
   docker pull <username>/team16-popl:submit-UTS
   docker run -p 3001:3001 -p 5173:5173 <username>/team16-popl:submit-UTS
   ```

---

## 🔒 Security Best Practices

1. **Never commit secrets** - Use GitHub Secrets
2. **Use access tokens** - Jangan gunakan password Docker Hub
3. **Limit token scope** - Token hanya untuk repository yang diperlukan
4. **Rotate tokens** - Ganti token secara berkala
5. **Review dependencies** - Check dependency audit results

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

---

## 🎓 Tips

### Speed up builds
- Use build cache (sudah enabled)
- Optimize Dockerfile layers
- Use `.dockerignore` untuk exclude unnecessary files

### Save Docker Hub bandwidth
- Only push on main branch untuk production
- Use PR builds untuk testing (tanpa push)

### Matrix builds
Workflow sudah support multi-platform:
- `linux/amd64` - Standard x86_64
- `linux/arm64` - Apple Silicon, ARM servers

### Manual workflow trigger
Bisa trigger workflow manual via GitHub UI:
1. Actions → Select workflow
2. Run workflow → Select branch
3. Run workflow

---

**Status Badges:**

Tambahkan ke README.md:

```markdown
![Docker Build](https://github.com/<username>/ayadesign-POPL-16/workflows/Docker%20Build%20and%20Push/badge.svg)
![Code Quality](https://github.com/<username>/ayadesign-POPL-16/workflows/Code%20Quality%20Checks/badge.svg)
```
