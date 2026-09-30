# Deploy Full Stack App - Single Deployment

Your app is now configured to serve both frontend and backend from one URL!

## What Was Done:

✅ Frontend built and copied to `backend/static/`
✅ Backend updated to serve static files
✅ API uses relative URLs (`/api`)
✅ Single deployment needed!

---

## Test Locally First

```powershell
cd backend
uvicorn app.main:app --reload
```

Then open: http://localhost:8000

You should see:
- Frontend loads at `/`
- API works at `/api/*`
- Docs at `/docs`

---

## Deploy to Render (Recommended)

### Step 1: Go to Render
https://render.com/

### Step 2: Create Web Service
- Click "New +" → "Web Service"
- Connect your GitHub repo (or paste URL)

### Step 3: Configure

**Name**: `growthintel`

**Root Directory**: `backend`

**Environment**: `Python 3`

**Build Command**:
```
pip install -r requirements.txt
```

**Start Command**:
```
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Instance Type**: Free

### Step 4: Deploy!

Click "Create Web Service"

Wait 2-5 minutes for deployment.

### Step 5: Get Your URL

You'll get: `https://growthintel.onrender.com`

That's it! Your app is live!

---

## Deploy to Railway

```powershell
cd backend
railway up
```

Then get your URL:
```powershell
railway domain
```

Done!

---

## What You Get:

✅ One URL for everything
✅ Frontend at: `https://your-app.com/`
✅ API at: `https://your-app.com/api/*`
✅ Docs at: `https://your-app.com/docs`
✅ No CORS issues!
✅ Simpler deployment!

---

## Update Frontend Later

When you make frontend changes:

```powershell
# 1. Build frontend
cd frontend
npm run build

# 2. Copy to backend
cd ..
xcopy /E /I /Y frontend\dist backend\static

# 3. Redeploy backend
cd backend
railway up
# or git push (if using GitHub auto-deploy)
```

---

## Advantages of This Method:

✅ One deployment instead of two
✅ No CORS configuration needed
✅ Simpler URL structure
✅ Backend serves everything
✅ Production-ready setup

---

## Ready to Deploy?

Choose your platform:

**Render** (Easiest):
1. Go to https://render.com/
2. New → Web Service
3. Configure as shown above
4. Deploy!

**Railway**:
```powershell
cd backend
railway up
```

Let's deploy! 🚀
