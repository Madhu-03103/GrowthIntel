# Deploy Backend Using Railway Web Interface (No CLI Required!)

## Step 1: Go to Railway
Open: https://railway.app/new

## Step 2: Sign Up/Login
- Click "Login"
- Choose "Login with GitHub" (easiest)
- Or use email

## Step 3: Create New Project
1. Click "Deploy from GitHub repo"
2. If you haven't pushed to GitHub yet, select "Empty Project" instead

## Step 4A: If Using GitHub

1. Click "Configure GitHub App"
2. Give Railway access to your repo
3. Select your repository
4. Railway will ask: "Select a service to deploy"
5. Choose your repository
6. Set **Root Directory** to: `backend`
7. Click "Deploy"

Railway will automatically:
- Detect Python
- Install from requirements.txt
- Start your FastAPI app

## Step 4B: If NOT Using GitHub (Manual Upload)

1. Click "Empty Project"
2. Click "New" → "Empty Service"
3. Click on the new service
4. Click "Settings" tab
5. Under "Source", click "Deploy from local directory"
6. Upload your `backend` folder

**OR** Zip your backend folder first:
1. Right-click `backend` folder → Send to → Compressed (zipped) folder
2. Upload the zip in Railway

## Step 5: Configure (If Needed)

Railway usually auto-detects everything, but if needed:

1. Go to "Settings" tab
2. Under "Build & Deploy":
   - **Build Command**: Leave empty (auto-detected)
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Click "Save"

## Step 6: Generate Domain

1. Go to "Settings" tab
2. Scroll to "Networking"
3. Click "Generate Domain"
4. Copy your URL: `https://your-app.up.railway.app`

## Step 7: Wait for Deployment

Watch the "Deployments" tab. You'll see:
- Building...
- Success! ✅

## Step 8: Test Your Backend

Open your Railway URL in browser:
```
https://your-app.up.railway.app/docs
```

You should see the FastAPI documentation page!

---

## After Backend is Live

Update your frontend:

1. Go to `frontend` folder
2. Create `.env.production`:
```
VITE_API_URL=https://your-app.up.railway.app
```

3. Redeploy frontend:
```powershell
cd frontend
vercel --prod --yes
```

Done! 🎉

---

## No GitHub? No Problem!

If you don't want to use GitHub, just:
1. Zip your `backend` folder
2. Upload it directly in Railway
3. Railway will deploy it

Easy!
