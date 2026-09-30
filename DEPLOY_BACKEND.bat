@echo off
cls
echo ========================================
echo   DEPLOYING BACKEND TO RAILWAY
echo ========================================
echo.
echo Step 1: Installing Railway CLI...
call npm install -g @railway/cli
echo.
echo Step 2: Opening Railway Login...
echo (A browser window will open - sign up/login)
echo.
pause
railway login
echo.
echo Step 3: Going to backend folder...
cd backend
echo.
echo Step 4: Initializing Railway project...
echo When asked for project name, type: employee-growth-backend
echo.
pause
railway init
echo.
echo Step 5: Deploying to Railway...
railway up
echo.
echo Step 6: Getting your backend URL...
railway domain
echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo COPY YOUR RAILWAY URL FROM ABOVE!
echo.
echo Next steps:
echo 1. Copy the Railway URL
echo 2. Update frontend with: VITE_API_URL=your-railway-url
echo 3. Redeploy frontend: vercel --prod
echo.
pause
