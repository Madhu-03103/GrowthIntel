# Employee Growth Intelligence System

**Predict. Understand. Develop. Grow.**

An AI-powered HR analytics platform that predicts employee career growth, identifies skill gaps, and provides personalized development recommendations.

## 🚀 Quick Deploy to Vercel

**Ready to deploy? Your app is Vercel-ready!**

```bash
# Windows
.\deploy-vercel.bat

# Mac/Linux
./deploy-vercel.sh
```

See [VERCEL_READY.md](VERCEL_READY.md) for deployment status and [QUICK_VERCEL_DEPLOY.md](QUICK_VERCEL_DEPLOY.md) for step-by-step guide.

---

## 🎯 Core Features

- **Growth Prediction**: ML-powered career trajectory forecasting
- **Real-time Analytics**: Professional dashboards with 18 interactive charts
- **Employee Management**: Complete CRUD with advanced filtering
- **Promotion Readiness**: Intelligent promotion probability assessment
- **Risk Detection**: Early identification of growth obstacles
- **Real-time Notifications**: Instant updates and alerts
- **CSV Export**: Data export functionality
- **What-If Simulator**: Interactive career scenario modeling
- **Role-based Access Control**: Secure JWT authentication

## 📱 Live Demo Features

### Executive Dashboard
- 6 KPI cards with trend indicators
- Growth distribution pie chart
- Risk assessment donut chart
- Department & role performance bars
- 5-axis performance radar chart
- Real-time activity feed (auto-refresh 30s)

### HR Analytics Dashboard
- Interactive filters (department, time range)
- Performance comparison charts
- Growth vs Performance scatter plot
- Stacked growth distribution
- Promotion readiness area chart
- Detailed metrics table
- Key insights panel

### Employee Management
- Complete CRUD operations
- Multi-criteria filtering
- Real-time notifications
- Individual profile pages
- Growth predictions
- Schedule reports

## 🏗️ Technology Stack

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS
- Recharts (18 professional charts)
- Axios + React Router

### Backend
- FastAPI + Python
- SQLAlchemy ORM
- JWT Authentication
- SQLite/PostgreSQL

### ML Pipeline
- scikit-learn + XGBoost
- Pandas + NumPy
- Growth prediction models

## 🚀 Quick Start

### Option 1: Run Locally (Development)

**Windows:**
```bash
.\quickstart.bat
```

**Mac/Linux:**
```bash
./quickstart.sh
```

### Option 2: Deploy to Vercel (Production)

**5-minute deployment:**
```bash
cd frontend
vercel --prod
```

See [QUICK_VERCEL_DEPLOY.md](QUICK_VERCEL_DEPLOY.md) for detailed instructions.

## 📚 Documentation

### Deployment Guides
- **[VERCEL_READY.md](VERCEL_READY.md)** - ✅ Deployment readiness status
- **[QUICK_VERCEL_DEPLOY.md](QUICK_VERCEL_DEPLOY.md)** - Fast deployment (5-15 min)
- **[VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)** - Comprehensive deployment guide

### Development Guides
- **[SETUP.md](SETUP.md)** - Local development setup
- **[RUN_PROJECT.md](RUN_PROJECT.md)** - How to run the project
- **[TESTING.md](TESTING.md)** - Testing guide
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Current implementation status

## 📦 Project Structure

```
employee-growth-intelligence/
├── frontend/               # React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/         # 5 main pages
│   │   ├── components/    # 9 reusable components
│   │   ├── services/      # API integration
│   │   └── types/         # TypeScript definitions
│   └── vercel.json        # Vercel config ✅
│
├── backend/               # FastAPI + Python
│   ├── app/
│   │   ├── api/          # 8 API modules
│   │   ├── models/       # 15+ database models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── core/         # Config, database, security
│   └── vercel.json        # Vercel config ✅
│
├── ml/                    # Machine learning
│   ├── prediction/       # Prediction models
│   └── training/         # Model training
│
├── vercel.json            # Main Vercel config ✅
├── deploy-vercel.bat      # Windows deployment script ✅
└── deploy-vercel.sh       # Linux/Mac deployment script ✅
```

## 🔐 Default Credentials

**Email:** admin@company.com  
**Password:** admin123

⚠️ **Change these in production!**

## 📊 Database

### Development: SQLite
- File: `backend/employee_growth.db`
- 500+ seeded employees
- 15+ tables

### Production: PostgreSQL (Recommended)
- Neon (free tier) - https://neon.tech
- Supabase - https://supabase.com
- Railway - https://railway.app

## 🌐 Deployment Options

### Option A: Frontend Only (5 min)
✅ Deploy frontend to Vercel  
✅ Keep backend running locally  
✅ Perfect for development  

```bash
cd frontend
vercel --prod
```

### Option B: Full Stack (15 min)
✅ Frontend → Vercel  
✅ Backend → Railway  
✅ Database → Neon (PostgreSQL)  

See [QUICK_VERCEL_DEPLOY.md](QUICK_VERCEL_DEPLOY.md) for step-by-step guide.

## 💻 Local Development

### Prerequisites
- Node.js 18+
- Python 3.10+
- npm or yarn

### Setup & Run

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt

# Initialize database
python scripts/seed_data.py

# Run backend (Terminal 1)
uvicorn app.main:app --reload

# Run frontend (Terminal 2)
cd ../frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication

### Employees
- `GET /api/employees/` - List employees (with filters)
- `GET /api/employees/{id}` - Employee details
- `POST /api/employees/` - Create employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee
- `GET /api/employees/export/csv` - Export to CSV

### Analytics
- `GET /api/analytics/overview` - Dashboard analytics
- `GET /api/analytics/departments` - Department analytics
- `GET /api/analytics/recent-activity` - Recent activity feed
- `GET /api/analytics/dashboard-refresh` - Refresh dashboard data

### Predictions
- `GET /api/predictions/growth/{id}` - Growth prediction
- `GET /api/predictions/promotion/{id}` - Promotion readiness
- `GET /api/predictions/risks/{id}` - Risk assessment

### Notifications
- `GET /api/notifications/` - User notifications
- `GET /api/notifications/unread-count` - Unread count
- `POST /api/notifications/{id}/mark-read` - Mark as read

Full API documentation: http://localhost:8000/docs

## 🎨 UI/UX Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Professional color scheme
- ✅ Smooth animations & transitions
- ✅ Interactive tooltips
- ✅ Loading states
- ✅ Toast notifications
- ✅ Modal dialogs
- ✅ Real-time updates (30s polling)

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
pytest

# Check diagnostics
npm run lint
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env):**
```bash
VITE_API_URL=http://localhost:8000/api
```

**Backend (.env):**
```bash
DATABASE_URL=sqlite:///./employee_growth.db
SECRET_KEY=your-secret-key-min-32-characters
ALLOWED_ORIGINS=http://localhost:3000
```

## 🔒 Security & Compliance

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (ADMIN, HR, MANAGER, EMPLOYEE)
- Password hashing with bcrypt
- Protected API routes

### Responsible AI
⚠️ **Important**: AI-generated insights are decision-support recommendations and should not be used as the sole basis for employment decisions.

### Data Privacy
- Employee data access restricted by role
- Employees can only view their own detailed information
- HR/Admin have organization-level access
- Audit logs for sensitive operations

## 📈 Performance

- Frontend: <2s initial load
- API: <100ms average response
- Charts: 60fps animations
- Real-time: 30s polling interval
- Bundle size: ~500KB (gzipped)

## 🗺️ Development Roadmap

- [x] Phase 1: Architecture + Database + Backend Foundation
- [x] Phase 2: Employee Management + Authentication
- [x] Phase 3: ML Pipeline + Predictions
- [x] Phase 4: Dashboard + Employee Intelligence
- [x] Phase 5: Real-time Notifications + CRUD
- [x] Phase 6: Professional Dashboards (18 Charts)
- [x] Phase 7: Advanced Filtering + CSV Export
- [x] Phase 8: Schedule Reports + Multi-filters
- [x] Phase 9: Vercel Deployment Ready ✅

## 🤝 Contributing

Contributions welcome! This is a production-quality demo system.

## 📝 License

MIT License

## 🆘 Support

- Documentation: See `/docs` folder and markdown files
- Issues: Open an issue on GitHub
- Deployment Help: See VERCEL_READY.md

## 🙏 Acknowledgments

Built with:
- React + Vite
- FastAPI
- Recharts
- Tailwind CSS
- scikit-learn

## 📞 Contact

For questions or support: [your-email@company.com]

---

**Made with ❤️ | Employee Growth Intelligence System**

🚀 **Ready to deploy?** → [VERCEL_READY.md](VERCEL_READY.md)
