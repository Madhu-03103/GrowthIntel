@echo off
cls
echo ========================================
echo   REDEPLOYING WITH FIXED CONFIG
echo ========================================
echo.
cd frontend
echo Deploying from: %CD%
echo.
vercel --prod --yes
echo.
echo ========================================
echo Check your URL now!
echo ========================================
pause
