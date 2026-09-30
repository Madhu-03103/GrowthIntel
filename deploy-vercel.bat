@echo off
echo ================================
echo Vercel Deployment Script
echo Employee Growth Intelligence
echo ================================
echo.

echo Choose deployment option:
echo 1. Frontend Only (Easiest)
echo 2. Check Installation
echo 3. Install Vercel CLI
echo 4. Login to Vercel
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto deploy_frontend
if "%choice%"=="2" goto check_install
if "%choice%"=="3" goto install_cli
if "%choice%"=="4" goto login_vercel

:check_install
echo.
echo Checking installations...
where vercel >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Vercel CLI is installed
    vercel --version
) else (
    echo [X] Vercel CLI not found
    echo Run option 3 to install
)
echo.
where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js is installed
    node --version
) else (
    echo [X] Node.js not found
    echo Please install Node.js from https://nodejs.org
)
echo.
pause
goto :eof

:install_cli
echo.
echo Installing Vercel CLI...
npm install -g vercel
echo.
echo Installation complete!
pause
goto :eof

:login_vercel
echo.
echo Opening Vercel login...
vercel login
echo.
pause
goto :eof

:deploy_frontend
echo.
echo ================================
echo Deploying Frontend to Vercel
echo ================================
echo.
cd frontend

echo Step 1: Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error installing dependencies
    pause
    goto :eof
)

echo.
echo Step 2: Building application...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Error building application
    pause
    goto :eof
)

echo.
echo Step 3: Deploying to Vercel...
echo.
echo IMPORTANT: When prompted:
echo - Set VITE_API_URL if backend is hosted separately
echo - Leave empty if using same domain or local backend
echo.
pause

vercel --prod

echo.
echo ================================
echo Deployment Complete!
echo ================================
echo.
echo Next Steps:
echo 1. Note the deployment URL provided above
echo 2. Update CORS in backend/app/main.py with this URL
echo 3. Start your backend: cd backend ^&^& uvicorn app.main:app --reload
echo 4. Access your app at the Vercel URL
echo.
echo For more details, see QUICK_VERCEL_DEPLOY.md
echo.

cd ..
pause
