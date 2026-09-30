#!/bin/bash

# Employee Growth Intelligence - Quickstart Script
# This script sets up and runs the entire application

set -e

echo "🚀 Employee Growth Intelligence - Quickstart"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Python 3 found"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Node.js found"

if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️${NC}  PostgreSQL client not found. Make sure PostgreSQL is installed."
fi

echo ""
echo "🗄️  Database Setup"
echo "===================="

# Check if database exists
if psql -lqt | cut -d \| -f 1 | grep -qw employee_growth_db; then
    echo -e "${YELLOW}Database 'employee_growth_db' already exists${NC}"
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        dropdb employee_growth_db 2>/dev/null || true
        createdb employee_growth_db
        echo -e "${GREEN}✓${NC} Database recreated"
    fi
else
    createdb employee_growth_db
    echo -e "${GREEN}✓${NC} Database created"
fi

echo ""
echo "🐍 Backend Setup"
echo "================="

cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -q -r requirements.txt
echo -e "${GREEN}✓${NC} Dependencies installed"

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✓${NC} .env file created"
fi

# Seed database
echo "Seeding database with demo data..."
python scripts/seed_data.py
echo -e "${GREEN}✓${NC} Database seeded"

cd ..

echo ""
echo "⚛️  Frontend Setup"
echo "=================="

cd frontend

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${GREEN}✓${NC} Dependencies already installed"
fi

cd ..

echo ""
echo "=============================================="
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "=============================================="
echo ""
echo "To start the application:"
echo ""
echo "  Terminal 1 (Backend):"
echo "  $ cd backend"
echo "  $ source venv/bin/activate"
echo "  $ uvicorn app.main:app --reload --port 8000"
echo ""
echo "  Terminal 2 (Frontend):"
echo "  $ cd frontend"
echo "  $ npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "Demo Credentials:"
echo "  Admin: admin@company.com / admin123"
echo "  Any Employee: [generated-email] / password123"
echo ""
echo "API Documentation: http://localhost:8000/docs"
echo ""
