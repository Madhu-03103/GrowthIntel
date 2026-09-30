@echo off
echo ============================================
echo   Employee Growth Intelligence System
echo   Starting Backend and Frontend Servers
echo ============================================
echo.
echo Opening 2 terminals...
echo.
echo Terminal 1: Backend (Port 8000)
echo Terminal 2: Frontend (Port 3000)
echo.
echo After both start, open: http://localhost:3000
echo Login: admin@company.com / admin123
echo.
echo ============================================

REM Start backend in new window
start "Backend Server" cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start frontend in new window
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ✓ Both servers starting in separate windows
echo ✓ Wait 10-15 seconds for them to fully start
echo ✓ Then open: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
