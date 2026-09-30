@echo off
cls
echo ========================================
echo   FRESH VERCEL DEPLOYMENT
echo ========================================
echo.
echo Cleared cache! Starting fresh deployment...
echo.
cd frontend
echo.
echo WHEN VERCEL ASKS QUESTIONS:
echo.
echo 1. "Set up and deploy?" 
echo    → Type: y
echo.
echo 2. "Which scope?" 
echo    → Select: madhu-sree-ts-projects
echo.
echo 3. "Link to existing project?"
echo    → Type: n (create NEW project)
echo.
echo 4. "What's your project's name?"
echo    → Type: growthapp
echo.
echo 5. "In which directory is your code located?"
echo    → Press Enter (use default ./)
echo.
pause
echo.
vercel --prod
echo.
pause
