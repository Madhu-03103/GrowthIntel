# Deploy Full Stack (Frontend + Backend) Together

## Method 1: Using Docker (Best!)

Deploy both frontend and backend as a single container.

### Step 1: Create Root Dockerfile

Create `Dockerfile` in the root directory:

```dockerfile
# Multi-stage build for frontend
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Python backend
FROM python:3.11-slim
WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist ./static

# Expose port
EXPOSE 8000

# Start command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Step 2: Update Backend to Serve Frontend

Modify `backend/app/main.py` to serve static files:

```python
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# After creating app
app = FastAPI(...)

# Mount static files
if os.path.exists("static"):
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")
    
    @app.get("/")
    async def serve_frontend():
        return FileResponse("static/index.html")
    
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = f"static/{full_path}"
        if os.path.exists(file_path):
            return FileResponse(file_path)
        return FileResponse("static/index.html")
```

### Step 3: Deploy to Railway

```powershell
railway login
railway init
railway up
```

Or deploy to Render with Docker support!

---

## Method 2: Serve Frontend from Backend (Simpler!)

Let FastAPI serve the React build files.

### Step 1: Build Frontend

```powershell
cd frontend
npm run build
```

This creates `frontend/dist/` folder.

### Step 2: Move Build to Backend

```powershell
# Copy frontend build to backend
xcopy /E /I frontend\dist backend\static
```

### Step 3: Update Backend `main.py`

Add this to `backend/app/main.py`:

```python
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI(...)

# Your API routes here
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
# ... other routes

# Serve static files AFTER API routes
static_dir = os.path.join(os.path.dirname(__file__), "..", "static")
if os.path.exists(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")
    
    @app.get("/")
    async def root():
        return FileResponse(os.path.join(static_dir, "index.html"))
    
    @app.get("/{full_path:path}")
    async def catch_all(full_path: str):
        file_path = os.path.join(static_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(static_dir, "index.html"))
```

### Step 4: Deploy Backend Only

Now deploy just the backend folder - it includes the frontend!

**On Render:**
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Root Directory: `backend`

**On Railway:**
```powershell
cd backend
railway up
```

Done! One URL serves everything!

---

## Method 3: Using Netlify/Vercel for Both

Deploy to Vercel with serverless functions.

### Configure `vercel.json` in root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    },
    {
      "src": "backend/app/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "backend/app/main.py" },
    { "src": "/(.*)", "dest": "frontend/dist/$1" }
  ]
}
```

Then deploy from root:
```powershell
vercel --prod
```

---

## Which Method Should You Use?

**Easiest**: Method 2 (Serve frontend from backend)
- Build frontend once
- Copy to backend/static
- Deploy backend only
- One URL for everything!

**Most Professional**: Method 1 (Docker)
- Production-ready
- Easy to scale
- Works on any platform

**Current Setup**: Keep them separate
- Frontend on Vercel
- Backend on Railway/Render
- Two URLs, but more flexible

**My Recommendation**: Use Method 2!

Let me know if you want me to set it up!
