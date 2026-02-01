# Lens Coffee Shop - Complete Setup Guide (Windows)

This guide will help you set up and run the complete full-stack application locally on Windows.

## ⚠️ YOU MUST DO THESE FIRST (Prerequisites)

**YOU MUST install these before proceeding:**

1. **Node.js (v18 or higher)** - Download from https://nodejs.org/
2. **PostgreSQL (v14 or higher)** - Download from https://www.postgresql.org/download/windows/
3. **VS Code (recommended)** - Download from https://code.visualstudio.com/

---

## Step 1: ⚠️ YOU MUST Install PostgreSQL

**YOU MUST complete this step:**

1. Download PostgreSQL installer from https://www.postgresql.org/download/windows/
2. Run the installer
3. During installation:
   - **YOU MUST set a password for `postgres` user (REMEMBER THIS PASSWORD!)**
   - Default port: 5432 (keep as is)
   - You can skip "Stack Builder" at the end

---

## Step 2: ⚠️ YOU MUST Create the Database

**YOU MUST run these commands:**

Open PowerShell or Command Prompt and run:

```bash
psql -U postgres
```

When prompted, enter your PostgreSQL password.

Then inside the psql prompt, run:

```sql
CREATE DATABASE lens_coffee;
\q
```

**Example:** If your PostgreSQL password is "admin123", you would type:
```
psql -U postgres
Password: [type admin123]
postgres=# CREATE DATABASE lens_coffee;
postgres=# \q
```

---

## Step 3: ⚠️ YOU MUST Setup Backend

**YOU MUST complete these steps IN ORDER:**

1. Open VS Code
2. Open the project folder (File → Open Folder → Select `lens-v2` folder)
3. Open Terminal in VS Code (View → Terminal or **Ctrl+`**)
4. Navigate to backend folder:

```bash
cd backend
```

5. **⚠️ YOU MUST delete old node_modules if they exist:**

```bash
rmdir /s /q node_modules
```

(If it says "cannot find", that's okay - just continue)

6. **⚠️ YOU MUST install dependencies:**

```bash
npm install
```

**This should install without errors now (no build tools needed)**

7. **⚠️ YOU MUST create environment file:**

**Option A - Rename the file (EASIEST):**
- In VS Code, find `backend/.env.example` in the file explorer
- Right-click → Rename → Change to `.env`

**Option B - Use command:**
```bash
copy .env.example .env
```

8. **⚠️ YOU MUST edit the `.env` file:**

Open `backend/.env` in VS Code and update with YOUR PostgreSQL password:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lens_coffee
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD_HERE    # ⚠️ Replace with YOUR actual password
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=http://localhost:5173
```

**Example:** If your password is "admin123", change the line to:
```env
DB_PASSWORD=admin123
```

---

## Step 4: ⚠️ YOU MUST Setup Frontend

**YOU MUST complete these steps:**

1. Open a **NEW** terminal in VS Code (Click the **+** button in terminal panel)
2. Make sure you're in the root directory:

```bash
cd ..
```

(This takes you back to the main `lens-v2` folder)

3. **⚠️ YOU MUST install frontend dependencies:**

```bash
npm install
npm install socket.io-client
```

4. **⚠️ YOU MUST create environment file:**

**Option A - Rename the file (EASIEST):**
- In VS Code, find `.env.example` in the root folder
- Right-click → Rename → Change to `.env`

**Option B - Use command:**
```bash
copy .env.example .env
```

5. **⚠️ YOU MUST verify the `.env` file:**

Open `.env` (in root folder, NOT backend) and make sure it contains:

```env
VITE_API_URL=http://localhost:3001/api
```

---

## Step 5: ⚠️ YOU MUST Run the Application

**YOU MUST keep TWO terminals open at the same time:**

### Terminal 1 - Backend Server (YOU MUST RUN THIS):

```bash
cd backend
npm run dev
```

**You should see:**
```
✅ Database connected successfully!
✅ All tables created
✅ Default users created (owner, admin, konobar)
🚀 Server running on http://localhost:3001
```

**⚠️ KEEP THIS TERMINAL RUNNING - DO NOT CLOSE IT**

**If you see errors, check the Troubleshooting section below**

---

### Terminal 2 - Frontend Server (YOU MUST RUN THIS):

1. Click the **+** button in VS Code terminal to open a NEW terminal
2. Run:

```bash
npm run dev
```

**You should see:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

**⚠️ KEEP THIS TERMINAL RUNNING - DO NOT CLOSE IT**

---

## Step 6: ⚠️ YOU MUST Access the Application

**YOU MUST open your browser and go to:**

**Customer Interface:** http://localhost:5173/

**Admin Login:** http://localhost:5173/admin/login

### Default Login Credentials:

**Owner Account (Full Access):**
- Username: `owner`
- Password: `owner123`
- Access: Full analytics, orders, stock management, menu management

**Employee Account (Limited Access):**
- Username: `konobar` (or `admin`)
- Password: `konobar123` (or `admin123`)
- Access: Orders, shift analytics, stock management only

---

## Optional: Add Sample Products

If you want to automatically add sample coffee/juice/hookah products:

**In a NEW terminal (Terminal 3):**

```bash
cd backend
npx ts-node src/scripts/seedProducts.ts
```

**You should see:**
```
✅ Products seeded successfully!
   - Added 12 coffee products
   - Added 8 juice products
   - Added 6 hookah products
```

---

## Troubleshooting Common Issues

### Issue 1: Backend won't start - "password authentication failed"

**YOU MUST check:**
1. Open `backend/.env`
2. Make sure `DB_PASSWORD=` matches your ACTUAL PostgreSQL password
3. No extra spaces before or after the password
4. Save the file
5. Stop the backend (Ctrl+C) and restart: `npm run dev`

**Example fix:**
```env
# Wrong:
DB_PASSWORD= admin123    (has extra space)

# Correct:
DB_PASSWORD=admin123
```

---

### Issue 2: Backend won't start - "database 'lens_coffee' does not exist"

**YOU MUST create the database:**
```bash
psql -U postgres
CREATE DATABASE lens_coffee;
\q
```

Then restart backend: `npm run dev`

---

### Issue 3: Backend won't start - "port 3001 already in use"

**Option A - Change the port:**
1. Open `backend/.env`
2. Change `PORT=3001` to `PORT=3002`
3. Open `.env` in root folder
4. Change `VITE_API_URL=http://localhost:3001/api` to `VITE_API_URL=http://localhost:3002/api`
5. Restart both servers

**Option B - Close the program using port 3001:**
1. Open Task Manager (Ctrl+Shift+Esc)
2. Find "Node.js" processes
3. End them
4. Try again

---

### Issue 4: Frontend shows "Cannot connect to backend"

**YOU MUST check:**
1. Backend is running (Terminal 1 should show "Server running on http://localhost:3001")
2. If backend crashed, check the error message and see Troubleshooting above
3. Make sure `.env` in root folder has: `VITE_API_URL=http://localhost:3001/api`

---

### Issue 5: Need to reset database completely

```bash
psql -U postgres
DROP DATABASE lens_coffee;
CREATE DATABASE lens_coffee;
\q
```

Then restart backend - tables will be recreated automatically.

---

## Quick Command Reference for VS Code

**To start the application, run these in separate terminals:**

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

**To stop servers:**
- Press **Ctrl + C** in each terminal

**To restart after making changes:**
- Stop with Ctrl+C
- Run `npm run dev` again

---

## What's Included

✅ Customer ordering interface with real-time cart
✅ Live order updates (Socket.IO)
✅ Employee dashboard (orders + shift analytics + stock management)
✅ Owner dashboard (full analytics + menu management + add/edit products)
✅ JWT authentication & role-based access
✅ PostgreSQL database (no build tools required)
✅ AI chat assistant UI (ready for API integration)
✅ Real-time notifications between customer and admin

---

## Summary: Complete Setup Checklist

- [ ] Install Node.js, PostgreSQL, VS Code
- [ ] Create `lens_coffee` database in PostgreSQL
- [ ] Run `cd backend` and `npm install`
- [ ] Rename `backend/.env.example` to `backend/.env`
- [ ] Edit `backend/.env` with your PostgreSQL password
- [ ] Run `npm install` and `npm install socket.io-client` in root folder
- [ ] Rename `.env.example` to `.env` in root folder
- [ ] Terminal 1: `cd backend && npm run dev`
- [ ] Terminal 2: `npm run dev`
- [ ] Open http://localhost:5173 in browser

**That's it! Your coffee shop management system is now running! ☕**
