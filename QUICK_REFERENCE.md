# Employee Growth Intelligence - Quick Reference Card

## 🚀 Quick Start Commands

### Setup (First Time Only)
```bash
# Create database
createdb employee_growth_db

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python scripts/seed_data.py

# Frontend setup
cd frontend
npm install
```

### Run Application
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Access Points
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | admin123 |
| Employee | [any generated email] | password123 |

---

## 📡 API Endpoints Cheat Sheet

### Authentication
```
POST   /api/auth/login              # Login
GET    /api/auth/me                 # Current user
```

### Employees
```
GET    /api/employees                # List (with filters)
GET    /api/employees/{id}          # Details
GET    /api/employees/{id}/overview # Full overview
```

### Predictions
```
GET    /api/predictions/growth/{id}           # Growth prediction
GET    /api/predictions/promotion/{id}        # Promotion readiness
GET    /api/predictions/risks/{id}            # Risk assessment
GET    /api/predictions/recommendations/{id}  # Recommendations
POST   /api/predictions/simulate              # What-if simulation
```

### Analytics
```
GET    /api/analytics/overview      # Dashboard metrics
GET    /api/analytics/departments   # Department analytics
GET    /api/analytics/growth-trends # Trends
```

---

## 🗄️ Database Quick Commands

```bash
# Connect to database
psql -d employee_growth_db

# Check employee count
SELECT COUNT(*) FROM employees;

# View departments
SELECT * FROM departments;

# Check predictions
SELECT COUNT(*) FROM growth_predictions;

# Sample employee data
SELECT employee_id, first_name, last_name, growth_score, promotion_readiness 
FROM employees 
LIMIT 10;

# Exit
\q
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if database exists
psql -l | grep employee_growth_db

# Check Python environment
which python
pip list

# Check port
lsof -i :8000  # Unix
netstat -ano | findstr :8000  # Windows
```

### Frontend won't start
```bash
# Clear node_modules
rm -rf node_modules
npm install

# Check port
lsof -i :3000  # Unix
netstat -ano | findstr :3000  # Windows
```

### Login fails
```bash
# Verify admin user exists
psql -d employee_growth_db -c "SELECT * FROM employees WHERE email='admin@company.com';"

# Re-seed database
python backend/scripts/seed_data.py
```

### Empty data
```bash
# Check database connection
psql -d employee_growth_db

# Re-run seed script
cd backend
python scripts/seed_data.py
```

---

## 📂 Project Structure Quick View

```
employee-growth-intelligence/
├── backend/           # FastAPI + PostgreSQL
│   ├── app/
│   │   ├── api/       # API endpoints
│   │   ├── core/      # Config & security
│   │   ├── models/    # Database models
│   │   └── schemas/   # Validation
│   └── scripts/       # Utilities
├── frontend/          # React + TypeScript
│   └── src/
│       ├── pages/     # UI pages
│       ├── components # Reusable components
│       └── services/  # API client
└── ml/                # Machine learning
    ├── training/      # Model training
    └── prediction/    # Prediction service
```

---

## 🎨 Key UI Pages

| Page | Route | Purpose |
|------|-------|---------|
| Login | `/login` | Authentication |
| Dashboard | `/dashboard` | Executive overview |
| Employees | `/employees` | Employee directory |
| Profile | `/employees/{id}` | Employee intelligence |
| Analytics | `/analytics` | Department insights |

---

## 🔐 Environment Variables

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/employee_growth_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=development
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000
```

---

## 🧪 Testing Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Database has data (500+ employees)
- [ ] Can login with admin credentials
- [ ] Dashboard shows metrics
- [ ] Can search employees
- [ ] Employee profile loads
- [ ] What-If simulator works
- [ ] No console errors

---

## 📊 Key Metrics

| Metric | Description | Range |
|--------|-------------|-------|
| Growth Score | Overall career growth | 0-100 |
| Promotion Readiness | Promotion probability | 0-100% |
| Performance Score | Job performance | 0-100 |
| Skill Score | Technical abilities | 0-100 |
| Learning Score | Development activity | 0-100 |
| Leadership Score | Leadership capacity | 0-100 |

---

## 🏷️ Status Labels

### Growth Levels
- **HIGH_GROWTH** - Score 80+
- **STABLE_GROWTH** - Score 60-79
- **SLOW_GROWTH** - Score 40-59
- **DECLINING** - Score <40

### Risk Levels
- **LOW** - Minimal risk
- **MEDIUM** - Some concerns
- **HIGH** - Significant risk
- **CRITICAL** - Immediate attention needed

### Readiness Categories
- **READY** - Promotion ready (75%+)
- **NEAR_READY** - Close to ready (60-74%)
- **DEVELOPING** - Building skills (40-59%)
- **HIGH_RISK** - Needs development (<40%)

---

## 🛠️ Useful Commands

### Backend
```bash
# Run backend
uvicorn app.main:app --reload --port 8000

# Run with custom host
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Check Python version
python --version

# Install dependencies
pip install -r requirements.txt

# Seed database
python scripts/seed_data.py
```

### Frontend
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Docker
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild
docker-compose up -d --build
```

### Database
```bash
# Create database
createdb employee_growth_db

# Drop database
dropdb employee_growth_db

# Backup database
pg_dump employee_growth_db > backup.sql

# Restore database
psql employee_growth_db < backup.sql
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Project overview |
| SETUP.md | Setup instructions |
| PROJECT_STATUS.md | Current status & roadmap |
| IMPLEMENTATION_SUMMARY.md | Complete summary |
| TESTING.md | Testing guide |
| DEPLOYMENT.md | Deployment strategies |
| PROJECT_MAP.md | Visual project map |
| QUICK_REFERENCE.md | This file |

---

## 🔗 Important Links

- **GitHub:** [Your repo URL]
- **API Docs:** http://localhost:8000/docs
- **Frontend:** http://localhost:3000
- **Postman Collection:** api-collection.json

---

## 🆘 Getting Help

### Check Logs
```bash
# Backend logs (if using systemd)
journalctl -u empgrowth-backend -n 100

# Frontend logs
# Check browser console (F12)

# Database logs
tail -f /var/log/postgresql/postgresql-*.log
```

### Common Issues

**"Module not found"**
- Backend: `pip install -r requirements.txt`
- Frontend: `npm install`

**"Database connection failed"**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

**"Port already in use"**
- Backend: Kill process on 8000
- Frontend: Kill process on 3000

**"Login fails"**
- Re-run seed script
- Check admin user exists
- Verify password

---

## 💡 Pro Tips

1. **Use API Docs:** http://localhost:8000/docs for testing
2. **Check Network Tab:** F12 → Network for API debugging
3. **Use Postman:** Import api-collection.json for testing
4. **Read Logs:** Check browser console for frontend errors
5. **Test Endpoints:** Use curl or Postman before UI
6. **Clear Cache:** Hard refresh (Ctrl+F5) if changes don't appear
7. **Check Database:** Verify data exists before debugging UI
8. **Use Git:** Commit often, never lose working code

---

## 📞 Support

For issues:
1. Check TESTING.md for test cases
2. Review DEPLOYMENT.md for setup issues
3. Check PROJECT_STATUS.md for known limitations
4. Review error logs
5. Create GitHub issue

---

**Employee Growth Intelligence**
*Predict. Understand. Develop. Grow.* 🚀

*Quick Reference v1.0 - Phase 1 Complete*
