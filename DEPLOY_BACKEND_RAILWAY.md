# Deploy Backend to Railway (5 Minutes)

Railway is FREE and perfect for Python backends!

## Step 1: Sign Up for Railway
1. Go to: https://railway.app/
2. Click "Start a New Project"
3. Sign up with GitHub (easiest)

## Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account
4. OR select "Empty Project" and we'll deploy manually

## Step 3: Deploy Backend

### Method A: Using Railway CLI (Easiest)

Install Railway CLI:
```powershell
npm install -g @railway/cli
```

Login:
```powershell
railway login
```

Deploy:
```powershell
cd backend
railway init
railway up
```

### Method B: Using GitHub (No CLI needed)

1. Push your code to GitHub
2. In Railway dashboard, click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Set root directory to: `backend`
6. Railway will auto-detect Python and deploy!

## Step 4: Configure Environment

Railway will auto-detect `requirements.txt` and run your app.

After deployment, Railway gives you a URL like:
```
https://your-app.railway.app
```

## Step 5: Update Frontend

Copy your Railway URL and run:
```powershell
cd frontend
```

Create `.env` file:
```
VITE_API_URL=https://your-app.railway.app
```

Redeploy frontend:
```powershell
vercel --prod --yes
```

## Done! 🎉

Your app is now fully deployed:
- Frontend on Vercel
- Backend on Railway

---

## Railway Features (Free Tier)
- ✅ 500 hours/month free
- ✅ Python support
- ✅ Database support
- ✅ Auto HTTPS
- ✅ Environment variables
- ✅ Automatic deploys

No credit card required for free tier!
