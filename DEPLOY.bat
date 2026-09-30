@echo off
cls
echo ===============================================
echo   DEPLOY TO VERCEL - EMPLOYEE GROWTH APP
echo ===============================================
echo.
echo This will deploy your frontend to Vercel.
echo.
echo Step 1: Login to Vercel (browser will open)
echo Step 2: Automatic deployment
echo Step 3: Get your deployment link!
echo.
pause
echo.
echo Opening Vercel login...
vercel login
echo.
echo.
echo ===============================================
echo   DEPLOYING FRONTEND TO VERCEL...
echo ===============================================
cd frontend
vercel --prod
echo.
echo ===============================================
echo   DEPLOYMENT COMPLETE!
echo ===============================================
echo.
echo Your app is now live on Vercel!
echo.
echo NEXT STEPS:
echo 1. Copy the deployment URL shown above
echo 2. Open it in your browser
echo 3. Login with: admin@company.com / admin123
echo.
echo To run backend locally:
echo   cd backend
echo   uvicorn app.main:app --reload
echo.
pause
