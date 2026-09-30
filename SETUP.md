# Employee Growth Intelligence - Setup Guide

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Create PostgreSQL database
createdb employee_growth_db

# Initialize database and seed data
python scripts/seed_data.py
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Start Application

Terminal 1 (Backend):
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Access: `http://localhost:3000`

## Demo Credentials

- **Admin**: `admin@company.com` / `admin123`
- **Any Employee**: Use generated emails / `password123`

## Project Structure

```
employee-growth-intelligence/
├── backend/               # FastAPI application
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Config & security
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── main.py
│   ├── scripts/          # Utility scripts
│   └── requirements.txt
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API clients
│   │   └── types/        # TypeScript types
│   └── package.json
├── ml/                    # ML pipeline (to be implemented)
└── data/                  # Datasets (to be implemented)
```

## Phase 1 Status ✓

**Completed:**
- Project architecture ✓
- Database schema (PostgreSQL) ✓
- Backend API (FastAPI) ✓
  - Authentication & JWT ✓
  - Employee management ✓
  - Predictions API ✓
  - Analytics API ✓
- Frontend foundation (React + TypeScript) ✓
  - Routing setup ✓
  - API services ✓
  - Type definitions ✓
- Seed data generation ✓

**Next Steps (Phase 2):**
- Complete UI components
- Dashboard implementation
- Employee directory
- Employee profile page
- ML model training
- Explainable AI (SHAP)
- What-if simulator
- Development plans

## Development Commands

### Backend
```bash
# Run backend
uvicorn app.main:app --reload --port 8000

# API docs
http://localhost:8000/docs

# Reseed database
python scripts/seed_data.py
```

### Frontend
```bash
# Development
npm run dev

# Build
npm run build

# Preview production
npm run preview
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Current user

### Employees
- GET `/api/employees` - List employees
- GET `/api/employees/{id}` - Employee details
- GET `/api/employees/{id}/overview` - Employee overview

### Predictions
- GET `/api/predictions/growth/{id}` - Growth prediction
- GET `/api/predictions/promotion/{id}` - Promotion prediction
- GET `/api/predictions/risks/{id}` - Risk assessment
- GET `/api/predictions/recommendations/{id}` - Recommendations
- GET `/api/predictions/development-plan/{id}` - Development plan
- POST `/api/predictions/simulate` - What-if simulation

### Analytics
- GET `/api/analytics/overview` - Dashboard metrics
- GET `/api/analytics/departments` - Department analytics
- GET `/api/analytics/growth-trends` - Growth trends

## Database Schema

**Core Tables:**
- `employees` - Employee profiles
- `departments` - Organizational units
- `roles` - Job roles
- `skills` - Skill catalog
- `employee_skills` - Employee skill assessments
- `performance_records` - Performance history
- `learning_records` - Training activities
- `projects` - Project assignments
- `growth_predictions` - ML predictions
- `promotion_predictions` - Promotion readiness
- `risk_assessments` - Risk evaluations
- `recommendations` - Action items
- `development_plans` - Growth roadmaps

## Technology Stack

**Backend:**
- FastAPI
- PostgreSQL
- SQLAlchemy
- JWT Authentication
- Python 3.9+

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Recharts
- React Router
- Axios

**ML (Upcoming):**
- Scikit-learn
- XGBoost
- SHAP
- Pandas
- NumPy

## Notes

- Demo data includes 500+ employees
- All predictions use demo/seed data
- ML models will be trained in Phase 3
- Current predictions are deterministic for demo purposes
