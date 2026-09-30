# Deploy Backend to PythonAnywhere (100% Free!)

PythonAnywhere is perfect for Python apps and completely free (no credit card needed)!

## Step 1: Sign Up

1. Go to: https://www.pythonanywhere.com/registration/register/beginner/
2. Choose a username
3. Create account (FREE - no credit card!)

## Step 2: Upload Your Code

### Method A: Upload Zip File

1. Zip your `backend` folder
2. In PythonAnywhere dashboard, go to "Files"
3. Click "Upload a file"
4. Upload `backend.zip`
5. Open a Bash console and extract:
   ```bash
   unzip backend.zip
   cd backend
   ```

### Method B: Use Git (If on GitHub)

1. Open Bash console in PythonAnywhere
2. Clone your repo:
   ```bash
   git clone https://github.com/YOUR-USERNAME/your-repo.git
   cd your-repo/backend
   ```

## Step 3: Install Dependencies

In the Bash console:

```bash
pip3 install --user -r requirements.txt
```

## Step 4: Create Web App

1. Go to "Web" tab
2. Click "Add a new web app"
3. Choose "Manual configuration"
4. Select "Python 3.10"

## Step 5: Configure WSGI File

1. Click on the WSGI configuration file link
2. Replace content with:

```python
import sys
import os

# Add your project directory to the sys.path
project_home = '/home/YOUR-USERNAME/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Import your FastAPI app
from app.main import app as application
```

Replace `YOUR-USERNAME` with your PythonAnywhere username!

## Step 6: Set Working Directory

1. In "Web" tab
2. Under "Code", set "Working directory" to:
   ```
   /home/YOUR-USERNAME/backend
   ```

## Step 7: Reload and Test

1. Click "Reload" button (green button)
2. Your app will be live at:
   ```
   https://YOUR-USERNAME.pythonanywhere.com
   ```

## Step 8: Update Vercel Frontend

Update your frontend environment variable:

```powershell
cd frontend
echo VITE_API_URL=https://YOUR-USERNAME.pythonanywhere.com/api > .env.production
vercel --prod --yes
```

Done! 🎉

---

## Pros of PythonAnywhere:

✅ 100% Free forever
✅ No credit card needed
✅ Python-focused
✅ Easy file management
✅ Bash console access
✅ Always online (doesn't sleep)

## Cons:

⚠️ Custom domains require paid plan
⚠️ Limited CPU (but fine for demo/testing)

---

## Troubleshooting

**If app doesn't start:**
1. Check error logs in "Web" tab → "Error log"
2. Make sure all dependencies installed
3. Check WSGI file has correct paths

**Database issues:**
- SQLite works fine on PythonAnywhere
- Your `employee_growth.db` will be created automatically

---

## Your URLs:

- **Frontend**: https://growthintel.vercel.app
- **Backend**: https://YOUR-USERNAME.pythonanywhere.com
- **API**: https://YOUR-USERNAME.pythonanywhere.com/api
- **Docs**: https://YOUR-USERNAME.pythonanywhere.com/docs

Perfect for demos and testing!
