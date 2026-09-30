#!/bin/bash

echo "================================"
echo "Vercel Deployment Script"
echo "Employee Growth Intelligence"
echo "================================"
echo ""

echo "Choose deployment option:"
echo "1. Frontend Only (Easiest)"
echo "2. Check Installation"
echo "3. Install Vercel CLI"
echo "4. Login to Vercel"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
  1)
    echo ""
    echo "================================"
    echo "Deploying Frontend to Vercel"
    echo "================================"
    echo ""
    cd frontend

    echo "Step 1: Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
      echo "Error installing dependencies"
      exit 1
    fi

    echo ""
    echo "Step 2: Building application..."
    npm run build
    if [ $? -ne 0 ]; then
      echo "Error building application"
      exit 1
    fi

    echo ""
    echo "Step 3: Deploying to Vercel..."
    echo ""
    echo "IMPORTANT: When prompted:"
    echo "- Set VITE_API_URL if backend is hosted separately"
    echo "- Leave empty if using same domain or local backend"
    echo ""
    read -p "Press enter to continue..."

    vercel --prod

    echo ""
    echo "================================"
    echo "Deployment Complete!"
    echo "================================"
    echo ""
    echo "Next Steps:"
    echo "1. Note the deployment URL provided above"
    echo "2. Update CORS in backend/app/main.py with this URL"
    echo "3. Start your backend: cd backend && uvicorn app.main:app --reload"
    echo "4. Access your app at the Vercel URL"
    echo ""
    echo "For more details, see QUICK_VERCEL_DEPLOY.md"
    echo ""

    cd ..
    ;;
  2)
    echo ""
    echo "Checking installations..."
    if command -v vercel &> /dev/null; then
      echo "[OK] Vercel CLI is installed"
      vercel --version
    else
      echo "[X] Vercel CLI not found"
      echo "Run option 3 to install"
    fi
    echo ""
    if command -v node &> /dev/null; then
      echo "[OK] Node.js is installed"
      node --version
    else
      echo "[X] Node.js not found"
      echo "Please install Node.js from https://nodejs.org"
    fi
    echo ""
    ;;
  3)
    echo ""
    echo "Installing Vercel CLI..."
    npm install -g vercel
    echo ""
    echo "Installation complete!"
    ;;
  4)
    echo ""
    echo "Opening Vercel login..."
    vercel login
    echo ""
    ;;
  *)
    echo "Invalid choice"
    ;;
esac
