# Quick Vercel Deployment Guide

## 🚀 Fastest Way to Deploy

### Option 1: Frontend Only (Easiest - 5 minutes)

This deploys just the frontend. Backend runs locally.

```bash
# Step 1: Install Vercel CLI
npm install -g vercel

# Step 2: Login to Vercel
vercel login

# Step 3: Deploy Frontend
cd frontend
vercel --prod

# Done! Your frontend is live.
```

**After deployment:**
1. Keep backend running locally: `cd backend && uvicorn app.main:app --reload`
2. Update CORS in `backend/app/main.py` with your Vercel URL
3. Access your app at the Vercel URL provided

---

### Option 2: Frontend + Cloud Database (Recommended - 15 minutes)

Deploy frontend to Vercel, backend to Railway, database to Neon.

#### Step 1: Set Up Database (Neon - Free)

```bash
# 1. Go to https://neon.tech
# 2. Sign up (free)
# 3. Create project
# 4. Copy connection string (starts with postgresql://)
```

#### Step 2: Deploy Backend (Railway - Free)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway init
railway up

# Add environment variables in Railway dashboard:
# - DATABASE_URL: your-neon-connection-string
# - SECRET_KEY: your-secret-key-32-chars
# - ALLOWED_ORIGINS: https://your-frontend.vercel.app

# Get your Railway URL (looks like: https://your-app.railway.app)
```

#### Step 3: Seed Database

```bash
# Set database URL
export DATABASE_URL="your-neon-connection-string"

# Run seed script
cd backend
python scripts/seed_data.py
```

#### Step 4: Deploy Frontend

```bash
cd frontend
vercel --prod

# When prompted:
# - Set VITE_API_URL: https://your-backend.railway.app/api
```

**Done! Your full-stack app is live.**

---

## 📋 Quick Checklist

After deployment:

- [ ] Frontend loads at Vercel URL
- [ ] Login page appears
- [ ] Can login (admin@company.com / admin123)
- [ ] Dashboard shows data
- [ ] Employees page loads
- [ ] No CORS errors in console

---

## 🔧 Configuration Files

All necessary files are created:

- ✅ `vercel.json` - Vercel configuration
- ✅ `frontend/vercel.json` - Frontend-only config
- ✅ `backend/vercel.json` - Backend config (if needed)
- ✅ `.vercelignore` - Files to ignore
- ✅ Frontend environment variable support added

---

## 🐛 Common Issues

### "CORS Error"
Add your Vercel URL to `backend/app/main.py`:
```python
allow_origins=[
    "http://localhost:3000",
    "https://your-app.vercel.app"  # Add this
]
```

### "Cannot connect to database"
- Verify DATABASE_URL in Railway dashboard
- Check database credentials
- Ensure database is accessible (some require IP whitelist)

### "API 404 errors"
- Check VITE_API_URL environment variable in Vercel
- Ensure it ends with `/api`
- Example: `https://your-backend.railway.app/api`

---

## 🎯 Alternative: One-Click Deploy

### GitHub Integration (Easiest)

```bash
# 1. Push code to GitHub
git init
git add .
git commit -m "Ready for deployment"
git remote add origin your-github-repo-url
git push -u origin main

# 2. Go to vercel.com
# 3. Click "Import Project"
# 4. Select your GitHub repo
# 5. Configure:
#    - Framework: Vite
#    - Root Directory: frontend
#    - Build Command: npm run build
#    - Output Directory: dist
# 6. Add environment variables (if needed)
# 7. Deploy!
```

---

## 📱 Mobile & Production Ready

Your deployed app includes:
- ✅ Responsive design (mobile-friendly)
- ✅ Professional dashboards with charts
- ✅ Real-time notifications
- ✅ Employee CRUD operations
- ✅ Analytics & filtering
- ✅ Export to CSV
- ✅ JWT authentication
- ✅ Role-based access control

---

## 💡 Pro Tips

1. **Use Environment Variables**: Never hardcode URLs or secrets
2. **Enable Analytics**: Vercel provides free analytics
3. **Custom Domain**: Add your domain in Vercel settings
4. **Preview Deployments**: Every git push creates a preview URL
5. **Monitor Logs**: Check Vercel and Railway logs for errors

---

## 🆘 Need Help?

1. Check full guide: `VERCEL_DEPLOYMENT.md`
2. Vercel Docs: https://vercel.com/docs
3. Railway Docs: https://docs.railway.app
4. Neon Docs: https://neon.tech/docs

---

## 🎉 You're All Set!

Your Employee Growth Intelligence System is now:
- 🌍 Live on the internet
- 🔒 Secure with JWT auth
- 📊 Full-featured with analytics
- 📱 Mobile responsive
- ⚡ Fast with CDN delivery

**Login Credentials:**
- Email: admin@company.com
- Password: admin123

**Enjoy your deployment!** 🚀
