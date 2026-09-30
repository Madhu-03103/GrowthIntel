from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .core.config import settings
from .core.database import init_db
import os

# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-powered HR analytics platform for employee growth intelligence"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    
    # Auto-seed database if empty (for production deployment)
    from .core.database import SessionLocal
    from .models.employee import Employee
    db = SessionLocal()
    try:
        # Check if database has any employees
        employee_count = db.query(Employee).count()
        if employee_count == 0:
            print("📦 Database is empty. Running seed script...")
            # Run seed script
            import sys
            sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
            from scripts.seed_data import main as seed_main
            seed_main()
            print("✅ Database seeded successfully!")
    except Exception as e:
        print(f"⚠️  Seed check failed: {e}")
    finally:
        db.close()
    
    print(f"🚀 {settings.PROJECT_NAME} v{settings.VERSION} started")
    print(f"📊 Database: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else 'configured'}")
    print(f"🔧 Environment: {settings.ENVIRONMENT}")


@app.get("/")
async def root():
    """Serve the frontend application"""
    static_dir = os.path.join(os.path.dirname(__file__), "..", "static")
    index_file = os.path.join(static_dir, "index.html")
    
    # If static files exist, serve the React app
    if os.path.exists(index_file):
        return FileResponse(index_file)
    
    # Otherwise, return API info (for development)
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "running",
        "docs": "/docs",
        "tagline": "Predict. Understand. Develop. Grow."
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.get("/seed")
async def manual_seed():
    """Manually seed the database - for initial setup"""
    from .core.database import SessionLocal
    from .models.employee import Employee
    
    db = SessionLocal()
    try:
        # Check current employee count
        employee_count = db.query(Employee).count()
        
        if employee_count > 0:
            return {
                "status": "skipped",
                "message": f"Database already has {employee_count} employees. Delete them first if you want to re-seed."
            }
        
        # Run seed script
        print("📦 Manual seed triggered. Running seed script...")
        import sys
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
        from scripts.seed_data import main as seed_main
        seed_main()
        print("✅ Database seeded successfully!")
        
        return {
            "status": "success",
            "message": "Database seeded successfully!",
            "employees_created": 500,
            "admin_email": "admin@company.com",
            "admin_password": "admin123"
        }
    except Exception as e:
        print(f"❌ Seed failed: {e}")
        import traceback
        return {
            "status": "error",
            "message": f"Seeding failed: {str(e)}",
            "traceback": traceback.format_exc()
        }
    finally:
        db.close()


@app.get("/debug/users")
async def debug_users():
    """Debug endpoint to check if users exist"""
    from .core.database import SessionLocal
    from .models.employee import Employee
    
    db = SessionLocal()
    try:
        employee_count = db.query(Employee).count()
        admin = db.query(Employee).filter(Employee.email == "admin@company.com").first()
        
        return {
            "total_employees": employee_count,
            "admin_exists": admin is not None,
            "admin_email": admin.email if admin else None,
            "admin_id": admin.id if admin else None,
            "database_url": settings.DATABASE_URL
        }
    finally:
        db.close()


# Import and include routers
from .api import employees, auth, predictions, analytics, notifications, goals, training, reviews

app.include_router(auth.router, prefix=f"{settings.API_PREFIX}/auth", tags=["Authentication"])
app.include_router(employees.router, prefix=f"{settings.API_PREFIX}/employees", tags=["Employees"])
app.include_router(predictions.router, prefix=f"{settings.API_PREFIX}/predictions", tags=["Predictions"])
app.include_router(analytics.router, prefix=f"{settings.API_PREFIX}/analytics", tags=["Analytics"])
app.include_router(notifications.router, prefix=f"{settings.API_PREFIX}/notifications", tags=["Notifications"])
app.include_router(goals.router, prefix=f"{settings.API_PREFIX}/goals", tags=["Goals"])
app.include_router(training.router, prefix=f"{settings.API_PREFIX}/training", tags=["Training"])
app.include_router(reviews.router, prefix=f"{settings.API_PREFIX}/reviews", tags=["Reviews"])

# Serve static files (frontend) - must be AFTER API routes
static_dir = os.path.join(os.path.dirname(__file__), "..", "static")
if os.path.exists(static_dir):
    # Mount assets folder
    assets_dir = os.path.join(static_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
    
    # Catch-all route for SPA - must be last
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Serve frontend for all non-API routes (SPA support)"""
        file_path = os.path.join(static_dir, full_path)
        
        # If file exists, serve it
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        
        # Otherwise, serve index.html (for client-side routing)
        return FileResponse(os.path.join(static_dir, "index.html"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
