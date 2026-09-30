# Vercel Deployment Guide - Employee Growth Intelligence System

## Overview
This guide helps you deploy the Employee Growth Intelligence System to Vercel with a serverless architecture.

## ⚠️ Important Notes

**Vercel Limitations:**
- Vercel is optimized for frontend and serverless functions
- SQLite database won't persist (serverless environment is stateless)
- You'll need a cloud database (PostgreSQL, MySQL, or MongoDB)

## Deployment Options

### Option 1: Frontend Only (Recommended for Quick Demo)
Deploy just the frontend to Vercel and keep backend running locally or on another platform.

### Option 2: Full Stack on Vercel
Deploy both frontend and backend to Vercel with a cloud database.

---

## Option 1: Frontend Only Deployment

### Step 1: Deploy Frontend to Vercel

```bash
# Navigate to frontend directory
cd frontend

# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Step 2: Update Backend API URL

After frontend deploys, you need to point it to your backend:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `VITE_API_URL` = `your-backend-url` (e.g., `http://localhost:8000` or your hosted backend)
3. Redeploy: `vercel --prod`

### Step 3: Update Backend CORS

In `backend/app/main.py`, add your Vercel URL to allowed origins:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-vercel-app.vercel.app"  # Add this
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Option 2: Full Stack Deployment

### Prerequisites

1. **Cloud Database** - Choose one:
   - [Neon](https://neon.tech) - Free PostgreSQL (Recommended)
   - [Supabase](https://supabase.com) - Free PostgreSQL
   - [PlanetScale](https://planetscale.com) - Free MySQL
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Free MongoDB

2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)

### Step 1: Set Up Cloud Database

#### Using Neon (PostgreSQL - Recommended):

1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:pass@host/db`)
4. Save it for later

### Step 2: Update Database Configuration

Create `backend/.env.production`:

```bash
DATABASE_URL=postgresql://user:pass@your-neon-host/dbname
SECRET_KEY=your-super-secret-key-min-32-chars-long
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000
```

### Step 3: Update SQLAlchemy for PostgreSQL

The app currently uses SQLite. Update `backend/app/core/database.py`:

```python
# Use environment variable for database URL
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./employee_growth.db")

# For PostgreSQL on Vercel, ensure connection pooling
if DATABASE_URL.startswith("postgresql"):
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10
    )
else:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
```

### Step 4: Deploy to Vercel

```bash
# From project root
vercel login

# Deploy
vercel --prod
```

### Step 5: Configure Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | Your PostgreSQL connection string | Production |
| `SECRET_KEY` | Your secret key (32+ chars) | Production |
| `VITE_API_URL` | Leave empty (uses relative URLs) | Production |

### Step 6: Initialize Database

Run migrations on your cloud database:

```bash
# Option A: Run locally pointing to cloud DB
export DATABASE_URL="your-cloud-db-url"
cd backend
python scripts/seed_data.py

# Option B: Use Vercel CLI
vercel env pull .env.production
python scripts/seed_data.py
```

---

## Alternative: Deploy Backend Separately

### Backend Options:

1. **Railway.app** (Easiest for Python)
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy backend
   cd backend
   railway login
   railway init
   railway up
   ```

2. **Render.com** (Free tier available)
   - Create account at render.com
   - New → Web Service
   - Connect GitHub repo
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Fly.io** (Good for Python apps)
   ```bash
   # Install Fly CLI
   curl -L https://fly.io/install.sh | sh
   
   # Deploy backend
   cd backend
   fly launch
   ```

---

## Vercel Configuration Files Created

### `/vercel.json` (Root - Full Stack)
Configures both frontend and backend deployment.

### `/frontend/vercel.json` (Frontend Only)
Configures only frontend deployment with SPA routing.

### `/backend/vercel.json` (Backend Only)
Configures only backend deployment as serverless functions.

---

## Quick Deploy Commands

### Frontend Only:
```bash
cd frontend
vercel --prod
```

### Full Stack:
```bash
# From project root
vercel --prod
```

### Backend Only (to separate project):
```bash
cd backend
vercel --prod
```

---

## Post-Deployment Checklist

- [ ] Frontend accessible at Vercel URL
- [ ] API endpoints responding (check `/api/docs`)
- [ ] Database connected and seeded
- [ ] Login working (admin@company.com / admin123)
- [ ] CORS configured for Vercel URL
- [ ] Environment variables set in Vercel dashboard
- [ ] Real-time features working (notifications, auto-refresh)

---

## Troubleshooting

### "Cannot find module" errors
- Ensure all dependencies in `package.json` or `requirements.txt`
- Run `npm install` or `pip install -r requirements.txt`

### Database connection errors
- Verify `DATABASE_URL` environment variable
- Check database credentials
- Ensure IP whitelist (some DBs require this)

### API 404 errors
- Check proxy configuration in `vite.config.ts`
- Verify `VITE_API_URL` environment variable
- Ensure backend routes start with `/api`

### CORS errors
- Add Vercel URL to `allow_origins` in `backend/app/main.py`
- Redeploy backend after CORS changes

---

## Recommended Architecture

For production, we recommend:

```
Frontend: Vercel
Backend: Railway.app or Render.com
Database: Neon (PostgreSQL) or Supabase
```

This provides:
- ✅ Free tier available
- ✅ Automatic deployments
- ✅ SSL certificates
- ✅ Global CDN (frontend)
- ✅ Persistent database
- ✅ Easy scaling

---

## Support

For deployment issues:
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs

## Next Steps

After successful deployment:
1. Set up custom domain (optional)
2. Configure monitoring and logging
3. Set up CI/CD with GitHub Actions
4. Enable analytics
5. Configure backup strategy for database
