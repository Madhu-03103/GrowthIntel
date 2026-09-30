@echo off
echo ========================================
echo   DEPLOYING FRONTEND TO VERCEL
echo ========================================
echo.

cd frontend

echo Current directory: %CD%
echo.
echo Starting Vercel deployment...
echo.
echo Answer the questions:
echo   1. Set up and deploy? → Y
echo   2. Which scope? → madhu-sree-ts-projects
echo   3. Link to existing project? → n
echo   4. Project name? → employee-growth-app
echo   5. Code directory? → ./ (just press Enter)
echo.

vercel --prod

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your app should now be live at:
echo https://employee-growth-app.vercel.app
echo.
pause
