@echo off
REM Employee Growth Intelligence - Quickstart Script for Windows

echo ===================================================
echo Employee Growth Intelligence - Quickstart
echo ===================================================
echo.

echo Checking prerequisites...

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed
    exit /b 1
)
echo [OK] Python found

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed
    exit /b 1
)
echo [OK] Node.js found

where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] PostgreSQL client not found
)

echo.
echo ===================================================
echo Database Setup
echo ===================================================

REM Create database
psql -U postgres -c "CREATE DATABASE employee_growth_db;" 2>nul
if %errorlevel% equ 0 (
    echo [OK] Database created
) else (
    echo [INFO] Database may already exist
)

echo.
echo ===================================================
echo Backend Setup
echo ===================================================

cd backend

REM Create virtual environment
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
call venv\Scripts\activate
echo Installing Python dependencies...
pip install -q -r requirements.txt
echo [OK] Dependencies installed

REM Create .env file
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo [OK] .env file created
)

REM Seed database
echo Seeding database with demo data...
python scripts\seed_data.py
echo [OK] Database seeded

cd ..

echo.
echo ===================================================
echo Frontend Setup
echo ===================================================

cd frontend

REM Install dependencies
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    call npm install
    echo [OK] Dependencies installed
) else (
    echo [OK] Dependencies already installed
)

cd ..

echo.
echo ===================================================
echo Setup Complete!
echo ===================================================
echo.
echo To start the application:
echo.
echo   Terminal 1 (Backend):
echo   ^> cd backend
echo   ^> venv\Scripts\activate
echo   ^> uvicorn app.main:app --reload --port 8000
echo.
echo   Terminal 2 (Frontend):
echo   ^> cd frontend
echo   ^> npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo Demo Credentials:
echo   Admin: admin@company.com / admin123
echo   Any Employee: [generated-email] / password123
echo.
echo API Documentation: http://localhost:8000/docs
echo.

pause
