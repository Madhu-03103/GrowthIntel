# Testing Guide - Employee Growth Intelligence

## Testing Strategy

This document outlines the testing approach for the Employee Growth Intelligence System.

## Manual Testing Checklist

### 1. Authentication Flow

**Test Login**
- [ ] Navigate to http://localhost:3000
- [ ] Should redirect to /login
- [ ] Enter admin credentials: admin@company.com / admin123
- [ ] Click "Sign In"
- [ ] Should redirect to /dashboard
- [ ] Verify user info appears in sidebar

**Test Invalid Login**
- [ ] Try logging in with wrong credentials
- [ ] Should show error message
- [ ] Should not redirect

**Test Logout**
- [ ] Click logout button in sidebar
- [ ] Should redirect to /login
- [ ] Verify token is removed
- [ ] Attempting to access /dashboard should redirect to /login

### 2. Dashboard

**Executive Overview**
- [ ] Navigate to /dashboard
- [ ] Verify all metric cards display:
  - Total Employees
  - Avg Growth Score
  - Promotion Ready
  - At Risk
  - High Potential
  - Avg Performance
- [ ] All numbers should be > 0
- [ ] Verify Growth Distribution shows 4 categories
- [ ] Verify Department Performance table shows departments
- [ ] Verify Top Growth Opportunities shows employees

**Data Validation**
- [ ] Check that totals add up correctly
- [ ] Verify percentages are between 0-100
- [ ] Verify no NaN or undefined values

### 3. Employee Directory

**List View**
- [ ] Navigate to /employees
- [ ] Should see table with employee list
- [ ] Verify columns: Employee, Department/Role, Experience, Growth Score, Promotion, Status
- [ ] All employees should have data

**Search Functionality**
- [ ] Type in search box
- [ ] Results should filter in real-time
- [ ] Try searching by:
  - Name (e.g., "John")
  - Employee ID (e.g., "EMP00001")
  - Email (e.g., "admin")
- [ ] Clear search should show all employees

**Click Through**
- [ ] Click on any employee row
- [ ] Should navigate to employee profile page
- [ ] URL should be /employees/{id}

### 4. Employee Profile

**Profile View**
- [ ] Navigate to specific employee (e.g., /employees/1)
- [ ] Verify all sections load:
  - Employee header with basic info
  - 4 metric cards (Growth, Promotion, Performance, Skills)
  - Competency breakdown with progress bars
  - Growth prediction explanation
  - What-If simulator

**Growth Intelligence**
- [ ] Verify Growth Score is displayed
- [ ] Verify Promotion Readiness percentage
- [ ] Check growth level badge (HIGH_GROWTH, etc.)
- [ ] Check risk level badge (LOW, MEDIUM, etc.)

**Explainable AI Section**
- [ ] Verify "Growth Prediction Explanation" section exists
- [ ] Should show explanation text
- [ ] Should show positive contributors (green)
- [ ] May show negative contributors (red)
- [ ] Each factor should have a numeric value

**What-If Simulator**
- [ ] Locate the simulator section (gradient background)
- [ ] Verify 4 sliders: Performance, Skills, Learning, Leadership
- [ ] Initial values should match employee's current scores
- [ ] Move sliders to different values
- [ ] Click "Run Simulation" button
- [ ] Results should appear below:
  - Current Growth Score
  - Projected Growth Score
  - Current Promotion Readiness
  - Projected Promotion Readiness
  - Impact explanation
- [ ] Projected scores should differ from current
- [ ] Try multiple simulations with different values

### 5. Analytics

**Department Analytics**
- [ ] Navigate to /analytics
- [ ] Verify department cards display
- [ ] Each card should show:
  - Department name
  - Total employees
  - Avg Growth score
  - Avg Performance
  - Promotion Ready count
  - At Risk count
  - Growth distribution breakdown

**Data Consistency**
- [ ] Compare analytics numbers with dashboard
- [ ] Totals should match across pages
- [ ] Verify all departments are represented

### 6. Navigation & UI

**Sidebar Navigation**
- [ ] Click Dashboard link - should navigate to /dashboard
- [ ] Click Employees link - should navigate to /employees
- [ ] Click Analytics link - should navigate to /analytics
- [ ] Active page should be highlighted in sidebar

**Responsive Design**
- [ ] Resize browser window
- [ ] Verify layout adapts reasonably
- [ ] Check on tablet viewport (768px)
- [ ] Sidebar should remain functional

**Visual Polish**
- [ ] Verify consistent spacing
- [ ] Check color scheme is professional
- [ ] Icons should render correctly
- [ ] No broken images or styles

### 7. Error Handling

**Network Errors**
- [ ] Stop backend server
- [ ] Try to load any page
- [ ] Should show loading state or error
- [ ] Start backend again
- [ ] Refresh - should work

**Invalid Routes**
- [ ] Navigate to /invalid-page
- [ ] Should redirect appropriately

**API Errors**
- [ ] Try accessing employee that doesn't exist: /employees/999999
- [ ] Should handle gracefully

## Backend API Testing

### Using Swagger UI

1. Navigate to http://localhost:8000/docs
2. Test each endpoint:

**Authentication**
```
POST /api/auth/login
Body: {
  "email": "admin@company.com",
  "password": "admin123"
}
Expected: 200, returns access_token
```

**Employees**
```
GET /api/employees
Expected: 200, returns employee list

GET /api/employees/1
Expected: 200, returns employee details

GET /api/employees/1/overview
Expected: 200, returns employee overview
```

**Predictions**
```
GET /api/predictions/growth/1
Expected: 200, returns growth prediction

GET /api/predictions/promotion/1
Expected: 200, returns promotion prediction

POST /api/predictions/simulate
Body: {
  "employee_id": 1,
  "modifications": {
    "performance_score": 90,
    "skill_score": 85
  }
}
Expected: 200, returns simulation result
```

**Analytics**
```
GET /api/analytics/overview
Expected: 200, returns dashboard metrics

GET /api/analytics/departments
Expected: 200, returns department analytics
```

## Database Testing

### Verify Data

```sql
-- Connect to database
psql -d employee_growth_db

-- Check employee count
SELECT COUNT(*) FROM employees;
-- Expected: 500+

-- Check departments
SELECT * FROM departments;
-- Expected: 8 departments

-- Check roles
SELECT * FROM roles;
-- Expected: 20+ roles

-- Check predictions exist
SELECT COUNT(*) FROM growth_predictions;
-- Expected: 200+

-- Check data quality
SELECT 
  COUNT(*) as total,
  AVG(growth_score) as avg_growth,
  AVG(promotion_readiness) as avg_promo
FROM employees 
WHERE is_active = 1;
-- All values should be reasonable
```

## Performance Testing

### Load Time Benchmarks

**Target Response Times:**
- Dashboard load: < 2 seconds
- Employee list: < 1 second
- Employee profile: < 1 second
- API endpoints: < 500ms

**Test with Browser DevTools:**
1. Open DevTools (F12)
2. Go to Network tab
3. Navigate to each page
4. Check response times
5. Verify no errors

## Common Issues & Solutions

### Issue: "Database connection failed"
**Solution:** 
- Verify PostgreSQL is running
- Check .env DATABASE_URL
- Ensure database exists: `psql -l | grep employee_growth_db`

### Issue: "Module not found" errors
**Solution:**
- Backend: `pip install -r requirements.txt`
- Frontend: `npm install`

### Issue: Login fails with correct credentials
**Solution:**
- Check if seed data ran: `SELECT * FROM employees WHERE email='admin@company.com';`
- Re-run seed script: `python backend/scripts/seed_data.py`

### Issue: Frontend shows 404 for API calls
**Solution:**
- Verify backend is running on port 8000
- Check vite proxy configuration
- Verify API_BASE in frontend/src/services/api.ts

### Issue: Empty data or no predictions
**Solution:**
- Re-run seed data script
- Check database has data
- Verify API endpoints return data in browser network tab

## Automated Testing (Future)

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Tests
- End-to-end testing with Playwright/Cypress
- API contract testing
- Database migration testing

## Test Data

### Test Accounts

**Admin Account**
- Email: admin@company.com
- Password: admin123
- Role: ADMIN
- Full Access

**Sample Employees**
- Check database for other employees
- All use password: password123
- Employee IDs: EMP00001 - EMP00500+

### Test Scenarios

**High Performer**
- Growth Score: 80-95
- Promotion Readiness: 75-95%
- Risk Level: LOW
- Growth Level: HIGH_GROWTH

**Average Performer**
- Growth Score: 60-79
- Promotion Readiness: 55-74%
- Risk Level: LOW/MEDIUM
- Growth Level: STABLE_GROWTH

**At-Risk Employee**
- Growth Score: 30-49
- Promotion Readiness: 20-34%
- Risk Level: HIGH/CRITICAL
- Growth Level: DECLINING

## Acceptance Criteria

The system is ready for demo if:

- [x] All authentication flows work
- [x] Dashboard displays real data
- [x] Employee directory is searchable
- [x] Employee profiles load completely
- [x] What-If simulator runs and shows results
- [x] Analytics page shows department breakdown
- [x] No console errors in browser
- [x] No 500 errors from API
- [x] Visual design is professional
- [x] Navigation works smoothly

## Next Phase Testing

Future testing phases will include:
- Unit tests for all components
- API integration tests
- ML model validation
- Load testing (100+ concurrent users)
- Security testing
- Accessibility testing (WCAG 2.1)
- Cross-browser testing
