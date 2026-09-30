@echo off
echo ========================================
echo   Building Full Stack App
echo ========================================
echo.

echo Step 1: Building frontend...
cd frontend
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Copying to backend...
cd ..
xcopy /E /I /Y frontend\dist backend\static

echo.
echo ========================================
echo   Build Complete!
echo ========================================
echo.
echo Frontend copied to: backend\static\
echo.
echo Next steps:
echo   1. Test locally: cd backend ^&^& uvicorn app.main:app --reload
echo   2. Deploy: cd backend ^&^& railway up
echo.
pause
