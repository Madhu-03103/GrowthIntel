# 🚀 HOW TO RUN THE PROJECT

## Your Setup is Complete! ✅

Everything is installed and ready. Here's how to run it:

---

## Method 1: Using 2 Terminals (Recommended)

### Terminal 1 - Start Backend

```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**You'll see:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

**Keep this terminal running!**

---

### Terminal 2 - Start Frontend

Open a **NEW terminal** and run:

```bash
cd frontend
npm run dev
```

**You'll see:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  press h + enter to show help
```

**Keep this terminal running too!**

---

## Method 2: Quick Commands

### Windows PowerShell

**Terminal 1:**
```powershell
cd C:\Users\HP\ml\backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

**Terminal 2:**
```powershell
cd C:\Users\HP\ml\frontend
npm run dev
```

---

## 🌐 Access the Application

Once both terminals are running:

1. Open your web browser
2. Go to: **http://localhost:3000**
3. You'll see the login page

### Login Credentials:

```
Email: admin@company.com
Password: admin123
```

---

## 🎯 What You'll See

### 1. Login Page
- Professional login screen
- Enter credentials above

### 2. Dashboard (After Login)
- Total employees: 500+
- Growth metrics
- Department performance
- Charts and insights

### 3. Employee Directory
- Browse all 500+ employees
- Search by name, email, ID
- Filter by department, role
- Click any employee to see their profile

### 4. Employee Profile
- Complete employee intelligence
- Growth score breakdown
- **What-If Simulator** (Try it! 🔥)
  - Adjust sliders for different scores
  - Click "Run Simulation"
  - See projected growth!

### 5. Analytics
- Department-wise insights
- Growth distribution
- Risk assessment

---

## 🛑 How to Stop

When you're done:

1. Go to each terminal
2. Press `Ctrl + C` to stop the server
3. Close the terminals

---

## ⚠️ Troubleshooting

### Backend Won't Start

**Error:** "Port 8000 is already in use"

**Solution:**
```powershell
# Find what's using port 8000
netstat -ano | findstr :8000

# Kill that process
taskkill /PID [process_id] /F
```

---

### Frontend Won't Start

**Error:** "Port 3000 is already in use"

**Solution:**
```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill that process
taskkill /PID [process_id] /F
```

---

### Can't Login

**Solution:**
1. Make sure backend is running (check Terminal 1)
2. Check backend URL: http://localhost:8000
3. Should see: `{"name":"Employee Growth Intelligence"...}`
4. If not, restart backend

---

### Page Won't Load

**Solution:**
1. Check both terminals are still running
2. Make sure no errors in Terminal 1 or 2
3. Try refreshing the browser (Ctrl + F5)
4. Check console (F12) for errors

---

## 📚 Quick Reference

| Item | URL | Purpose |
|------|-----|---------|
| Frontend | http://localhost:3000 | Main application |
| Backend | http://localhost:8000 | API server |
| API Docs | http://localhost:8000/docs | Swagger API documentation |

---

## 🎉 You're All Set!

Your Employee Growth Intelligence System is ready to use!

**Next Steps:**
1. Start both servers (see above)
2. Open http://localhost:3000
3. Login with admin credentials
4. Explore the features!

**Must-Try Feature:** Go to any employee profile and use the **What-If Simulator**!

---

## 💡 Tips

- Keep both terminals visible so you can see logs
- If something breaks, check the terminal for error messages
- Press `Ctrl + C` in a terminal to stop that server
- You can restart anytime by running the commands again

---

**Need More Help?**
- Read **QUICK_REFERENCE.md** for common commands
- Read **TESTING.md** for test cases
- Check **START_HERE.md** for project overview

---

*Ready to predict, understand, develop, and grow!* 🚀
