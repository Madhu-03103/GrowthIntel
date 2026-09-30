@echo off
echo ========================================
echo   REDEPLOYING FRONTEND TO VERCEL
echo ========================================
echo.

cd frontend

echo Step 1: Rebuilding the project...
call npm run build
echo.

echo Step 2: Deploying to Vercel...
echo.
echo IMPORTANT: When Vercel asks questions:
echo   - "Set up and deploy?" → Press Y
echo   - "Which scope?" → Select madhu-sree-ts-projects
echo   - "Link to existing project?" → Press Y (if you see your project)
echo   - OR create new project if you don't see it
echo.

vercel --prod

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
pause
