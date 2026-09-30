# Deploy Backend via GitHub + Railway (Easiest & Most Reliable!)

This method avoids file size issues by using GitHub as the source.

## Step 1: Push Your Code to GitHub (If Not Already)

### Option A: If You Have a GitHub Repo Already
Skip to Step 2!

### Option B: Create New GitHub Repo

1. Go to: https://github.com/new
2. Repository name: `employee-growth-app`
3. Keep it **Public** (or Private if you have GitHub Pro)
4. Click "Create repository"

Then push your code:
```powershell
cd C:\Users\HP\ml
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/employee-growth-app.git
git push -u origin main
```

## Step 2: Deploy from GitHub to Railway

1. Go to Railway Dashboard: https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Click "Configure GitHub App"
5. Give Railway access to your repository
6. Select your `employee-growth-app` repository
7. Railway will show services detected
8. Click on the backend service

## Step 3: Configure Root Directory

Since your backend is in a subfolder:

1. Click on the service
2. Go to "Settings" tab
3. Find "Root Directory"
4. Enter: `backend`
5. Click "Save"

## Step 4: Add Start Command (If Needed)

1. In Settings, find "Deploy"
2. Under "Start Command", enter:
   ```
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
3. Click "Save"

## Step 5: Generate Domain

1. Go to "Settings" tab
2. Scroll to "Networking"
3. Click "Generate Domain"
4. You'll get: `https://growthintel-production.up.railway.app`

## Step 6: Redeploy (If Needed)

If it doesn't auto-deploy:
1. Go to "Deployments" tab
2. Click "Deploy Now"

---

## Alternative: Use Railway Web Upload (Smaller Files Only)

If you don't want to use GitHub:

### Step 1: Create Clean Backend Folder

1. Create a new folder: `C:\Users\HP\ml\backend-deploy`
2. Copy ONLY these files:
   - `app/` folder (entire folder)
   - `requirements.txt`
   - `Procfile`
   - `runtime.txt`
   - `railway.toml`
   - `.railwayignore`
3. **DO NOT copy**: `venv`, `__pycache__`, `*.db` files

### Step 2: Zip the Clean Folder

1. Right-click `backend-deploy` folder
2. Send to → Compressed (zipped) folder
3. Name it: `backend.zip`

### Step 3: Upload to Railway

1. Go to: https://railway.app/dashboard
2. Find your `growthintel` project (already created)
3. Click "New" → "Empty Service"
4. Click the new service
5. Settings → Source → "Upload from Local"
6. Upload `backend.zip`
7. Railway will extract and deploy!

---

## After Deployment Succeeds

### Get Your Railway URL

Example: `https://growthintel-production.up.railway.app`

### Test Backend
Visit: `https://your-url.up.railway.app/docs`

Should show FastAPI documentation!

### Update Frontend

```powershell
cd frontend
```

Create `.env.production`:
```
VITE_API_URL=https://growthintel-production.up.railway.app
```

Redeploy frontend:
```powershell
vercel --prod --yes
```

---

## Which Method Should You Use?

**Easiest**: GitHub + Railway (recommended)
- Push to GitHub once
- Connect to Railway
- Auto-deploys on every push!

**Quick & Dirty**: Clean folder upload
- No Git needed
- Manual redeployment each time

Choose based on your preference!
