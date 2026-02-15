# Deployment & GitHub Guide: ESITH PFE Platform

This guide covers how to push your project to GitHub and deploy it live on Render.com.

## 1. Prepare for GitHub

### A. Create a `.gitignore`
Ensure you have a `.gitignore` file in the root directory to avoid uploading sensitive or bulky files.

**Root `.gitignore`**:
```text
node_modules/
.env
dist/
server/prisma/dev.db
server/uploads/chat/*
server/uploads/profiles/*
```

### B. Push to GitHub
1. Create a new repository on GitHub.
2. Run these commands in your project root:
```bash
git init
git add .
git commit -m "Initialize ESITH PFE Platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

---

## 2. Deploy on Render.com

Render is great for hosting both your Node.js backend and React frontend.

### A. Backend Deployment (Web Service)
1. **Connect Repository**: Connect your GitHub repo to Render.
2. **Service Type**: Web Service.
3. **Environment**: Node.
4. **Build Command**: `cd server && npm install && npx prisma generate && npm run build` (if using TS) or just `npm install`.
5. **Start Command**: `cd server && node dist/index.js` (or `npm start`).
6. **Environment Variables**:
   - `PORT`: 3000
   - `DATABASE_URL`: (Use an external PostgreSQL on Render or stick to SQLite for now - *Note: SQLite will reset on redeploy unless using Disks*).
   - `JWT_SECRET`: A long random string.
   - `FRONTEND_URL`: Your Render frontend URL (e.g., `https://esith-pfe.onrender.com`).

### B. Frontend Deployment (Static Site)
1. **Connect Repository**: Same repo.
2. **Service Type**: Static Site.
3. **Build Command**: `cd client && npm install && npm run build`.
4. **Publish Directory**: `client/dist`.
5. **Environment Variables**:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://esith-pfe-api.onrender.com/api`).

---

## 3. How to Use the Platform

### Roles
- **Student**: Can view PFEs, add Alumni/Company contacts, create new PFE projects, and participate in Chats.
- **Admin**: Can do everything a student can, PLUS delete any entry and promote other users to Admin.

### Key Features
- **Dashboard**: Real-time statistics of the platform.
- **Campus Live**: Audio/Video messaging in group chats.
- **Network**: Centralized database of ESITH Alumni.
- **PFE Hub**: Repository of past and current end-of-year projects.

### Registration
Users must register with an `@esith.net` email address to ensure platform security.
