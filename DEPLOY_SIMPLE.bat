@echo off
cls
echo ========================================
echo   DEPLOYING TO VERCEL - SIMPLE METHOD
echo ========================================
echo.
echo Step 1: Going to frontend folder...
cd frontend
echo Current directory: %CD%
echo.
echo Step 2: Starting deployment...
echo.
echo WHEN VERCEL ASKS:
echo   1. "Set up and deploy?" → Type: y
echo   2. "Which scope?" → Select: madhu-sree-ts-projects  
echo   3. "Link to existing project?" → Type: y
echo   4. Select the project from list
echo.
pause
echo.
vercel --prod
echo.
echo ========================================
echo   DONE!
echo ========================================
pause
