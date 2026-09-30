# Deploy Backend to Railway - Easy Method

## Method 1: Using Railway CLI (Fastest - 3 minutes)

### Step 1: Install Railway CLI
```powershell
npm install -g @railway/cli
```

Wait for installation to complete.

### Step 2: Login to Railway
```powershell
railway login
```

This will open a browser window. Sign up/login with:
- GitHub (recommended)
- Or email

### Step 3: Navigate to Backend Folder
```powershell
cd backend
```

### Step 4: Initialize Railway Project
```powershell
railway init
```

When prompted:
- **Project name?** → Type: `employee-growth-backend`
- Press Enter

### Step 5: Deploy!
```powershell
railway up
```

This will:
1. Upload your backend code
2. Install dependencies from requirements.txt
3. Start your FastAPI server
4. Give you a live URL!

### Step 6: Get Your Backend URL
```powershell
railway open
```

Or check the Railway dashboard for your URL like:
```
https://employee-growth-backend-production.up.railway.app
```

---

## Method 2: Using Railway Web Interface (No CLI)

### Step 1: Go to Railway
Open: https://railway.app/

### Step 2: Sign Up
- Click "Start a New Project"
- Login with GitHub or Email

### Step 3: Create New Project
1. Click "New Project"
2. Select "Empty Project"

### Step 4: Upload Backend Files

**Option A: Connect GitHub (Recommended)**
1. Push your code to GitHub first
2. In Railway, click "New" → "GitHub Repo"
3. Select your repo
4. Set Root Directory: `backend`
5. Railway auto-deploys!

**Option B: Deploy from Local (Drag & Drop)**
1. Click "New" → "Empty Service"
2. Click the service
3. Go to "Settings" tab
4. Click "Source" → Upload your `backend` folder

### Step 5: Configure (Railway does this automatically)
Railway auto-detects:
- ✅ Python project
- ✅ requirements.txt
- ✅ Start command

### Step 6: Get Your URL
1. Go to "Settings" tab
2. Click "Networking" → "Generate Domain"
3. Copy your URL like: `https://your-app.railway.app`

---

## After Backend is Deployed

### Update Frontend to Use Railway Backend

1. Copy your Railway URL (e.g., `https://employee-growth-backend-production.up.railway.app`)

2. Create environment variable file:
```powershell
cd ../frontend
echo VITE_API_URL=https://your-railway-url.railway.app > .env.production
```

3. Redeploy frontend:
```powershell
vercel --prod --yes
```

---

## Quick Copy-Paste Commands

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Go to backend
cd backend

# Initialize and deploy
railway init
railway up

# Get URL
railway domain

# Go back and update frontend
cd ../frontend
```

Then create `.env.production` with your Railway URL and redeploy frontend.

---

## Troubleshooting

**If Railway CLI install fails:**
Use the web interface method instead (Method 2)

**If deployment fails:**
Check Railway logs:
```powershell
railway logs
```

**If you need to redeploy:**
```powershell
cd backend
railway up
```

---

## Free Tier Limits
- ✅ 500 hours/month (plenty for testing)
- ✅ $5 free credit
- ✅ No credit card required initially
- ✅ Auto-sleep after inactivity (wakes on request)

---

## Start Now!

Run this:
```powershell
npm install -g @railway/cli
railway login
cd backend
railway init
railway up
```

That's it! 🚀
