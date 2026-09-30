# Deploy Backend to Render (Easiest Alternative!)

Render is simpler than Railway and has a better free tier for Python!

## Step 1: Go to Render
Open: https://render.com/

## Step 2: Sign Up
- Click "Get Started"
- Sign up with GitHub (recommended)
- Or use email

## Step 3: Create New Web Service

1. Click "New +" button (top right)
2. Select "Web Service"

## Step 4: Connect Repository

**Option A: Using GitHub (Recommended)**
1. Connect your GitHub account
2. Select your repository
3. Render will list it

**Option B: Without GitHub (Public Git URL)**
1. Enter your repo URL
2. Or upload code manually

**Option C: Manual Deploy**
1. Skip for now, we'll use the dashboard

## Step 5: Configure Service

Fill in these settings:

- **Name**: `employee-growth-backend`
- **Region**: Choose closest to you
- **Branch**: `main` or `master`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## Step 6: Choose Free Plan

- Scroll down to "Instance Type"
- Select **Free** (0$/month)
- Click "Create Web Service"

## Step 7: Wait for Deploy

Render will:
1. Clone your code
2. Install dependencies
3. Start your app
4. Give you a URL!

Watch the logs in real-time. Takes 2-5 minutes.

## Step 8: Get Your URL

After deployment succeeds, you'll see:
```
https://employee-growth-backend.onrender.com
```

Copy this URL!

## Step 9: Test Backend

Visit:
```
https://employee-growth-backend.onrender.com/docs
```

Should show FastAPI docs!

---

## Update Frontend

1. Go to frontend folder
2. Create `.env.production`:
```
VITE_API_URL=https://employee-growth-backend.onrender.com
```

3. Redeploy:
```powershell
cd frontend
vercel --prod --yes
```

---

## Render Free Tier

✅ 750 hours/month free
✅ Automatic HTTPS
✅ Custom domains
✅ Auto-deploys from GitHub
⚠️ Sleeps after 15 min inactivity (wakes on first request)

---

## Without GitHub?

1. Create account on Render
2. Click "New Web Service"
3. Choose "Public Git repository"
4. Paste: Your repo URL or any public repo
5. Or use Render's "Deploy from Disk" feature

---

## Quick Start

1. Go to: https://render.com/
2. Sign up with GitHub
3. New → Web Service
4. Connect repo
5. Set root directory: `backend`
6. Deploy!

That's it! 🚀
