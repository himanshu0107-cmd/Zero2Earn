# ✅ Zero2Earn - Complete Setup & Run Guide

**Last Updated**: April 12, 2026  
**Status**: Ready to Deploy

---

## 📋 Prerequisites Check

Before running the application, verify you have:

### ✅ Required Software

**1. Java 21**
```bash
# Verify Java is installed:
java -version

# Should show: version "21..." or higher
# If not installed, download from:
# https://adoptopenjdk.net/ or 
# https://www.oracle.com/java/technologies/downloads/
```

**2. PostgreSQL 12+**
```bash
# Verify PostgreSQL is installed:
psql --version

# Should show: psql (PostgreSQL) 12.0 or higher
# If not installed, download from:
# https://www.postgresql.org/download/windows/
```

**3. Node.js 18+**
```bash
# Verify Node.js is installed:
node --version
npm --version

# Should show: v18.0.0 or higher
# If not installed, download from:
# https://nodejs.org/
```

**4. Maven 3.8+**
```bash
# Verify Maven is installed:
mvn --version

# Should show: Apache Maven 3.8.0 or higher
# If not installed, follow:
# https://maven.apache.org/install.html
```

---

## 🚀 Setup & Run (4 Steps)

### Step 1️⃣: Setup Database (PostgreSQL)

**Option A: Using Automated Script (Windows)**
```powershell
# Run PowerShell as Administrator
powershell -ExecutionPolicy Bypass -File RUN_APPLICATION.ps1
```

**Option B: Manual Setup**

1. Start PostgreSQL (if not running):
   ```bash
   # Windows Service - Check Services app
   # OR start from command line:
   pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start
   ```

2. Create database:
   ```bash
   # Connect to PostgreSQL:
   psql -U postgres -h localhost
   
   # In psql terminal, run:
   CREATE DATABASE zero2earn;
   \q
   ```

3. Import schema:
   ```bash
   psql -U postgres -h localhost -d zero2earn -f backend\src\main\resources\schema_postgres.sql
   ```

4. Verify database:
   ```bash
   psql -U postgres -h localhost -d zero2earn -c "SELECT COUNT(*) FROM users;"
   ```
   Should return: `count | 10` (or similar with sample data)

✅ **Database is ready!**

---

### Step 2️⃣: Start Backend

Open Terminal/Command Prompt:

```bash
# Navigate to backend
cd backend

# Build and start
mvn spring-boot:run
```

**Expected Output:**
```
Started Zero2EarnApplication in XX.XXX seconds
o.s.b.w.embedded.tomcat.TomcatWebServer : Tomcat started on port(s): 8080
```

✅ **Backend ready at: http://localhost:8080**

**To verify backend is working:**
```bash
# In another terminal:
curl http://localhost:8080/api/auth/validate
```

---

### Step 3️⃣: Start Frontend

Open New Terminal/Command Prompt:

```bash
# Navigate to frontend
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in XXX ms

➜  Local:   http://localhost:5173
➜  press h to show help
```

✅ **Frontend ready at: http://localhost:5173**

---

### Step 4️⃣: Access & Test Application

1. **Open Browser**
   - Go to: http://localhost:5173

2. **Login with Test Account**
   ```
   Email: admin@zero2earn.com
   Password: admin123
   ```

3. **Test Features**
   - ✅ Dashboard - View profile and stats
   - ✅ JobFeed - Browse available tasks
   - ✅ PostJob - Create a new task (if Admin/Teacher)
   - ✅ Profile - View user information
   - ✅ Courses - Browse course marketplace
   - ✅ Leaderboard - See top performers
   - ✅ Chat - Real-time messaging

---

## 📌 Test Accounts

### Admin Account (Full Access)
```
Email:    admin@zero2earn.com
Password: admin123
Role:     ADMIN
```

### Teacher Account (Can Post Jobs)
```
Email:    teacher@zero2earn.com
Password: password123
Role:     TEACHER
```

### Student Account (Can Apply)
```
Email:    student@zero2earn.com
Password: password123
Role:     STUDENT
```

### Additional Test Accounts
```
studentA@zero2earn.com    / password123 / STUDENT
studentB@zero2earn.com    / password123 / STUDENT
teacher02@zero2earn.com   / password123 / TEACHER
```

---

## 🔍 Verification Checklist

After starting the application, verify:

**Frontend ✅**
- [ ] Can access http://localhost:5173
- [ ] Can login with test account
- [ ] Dashboard loads without errors
- [ ] Can navigate all pages
- [ ] Forms submit without errors

**Backend ✅**
- [ ] API responds at http://localhost:8080/api
- [ ] JWT token generated on login
- [ ] Protected endpoints require auth
- [ ] Database queries work

**Database ✅**
- [ ] Can connect to localhost:5432
- [ ] Database 'zero2earn' exists
- [ ] Tables created (users, jobs, etc.)
- [ ] Sample data loaded

---

## 🔧 Troubleshooting

### Issue: "port 8080 in use"
```bash
# Find what's using port 8080:
netstat -ano | findstr :8080

# Kill the process or change port in:
# backend/src/main/resources/application.properties
# Change: server.port=8081
```

### Issue: "port 5173 in use"
```bash
# Vite will auto-try 5174, 5175, etc.
# OR kill the process using port 5173
```

### Issue: "PostgreSQL connection refused"
```bash
# Verify PostgreSQL is running:
psql -U postgres -h localhost

# If error, start PostgreSQL:
# Windows: Check "PostgreSQL XX" in Services
# OR: pg_ctl start -D "path/to/data"
```

### Issue: "Java not found"
```bash
# Set JAVA_HOME:
# Windows: Set-Item -Path 'env:JAVA_HOME' -Value 'C:\Program Files\OpenJDK\openjdk-21'
# Then verify: java -version
```

### Issue: "npm install fails"
```bash
# Clear npm cache:
npm cache clean --force

# Try install again:
npm install
```

### Issue: "Database not found"
```bash
# Make sure you ran the schema import:
psql -U postgres -h localhost -d zero2earn -f backend/src/main/resources/schema_postgres.sql
```

### Issue: "Token expired on login"
```bash
# JWT tokens expire in 24 hours
# Logout and login again
# Clear browser storage: localStorage.clear()
```

---

## 📊 Services Status

After everything is running:

| Service | URL | Expected Response |
|---------|-----|------------------|
| **Frontend** | http://localhost:5173 | React app loads |
| **Backend API** | http://localhost:8080/api | 404 (expected) |
| **Auth Validate** | http://localhost:8080/api/auth/validate | 401 unauthorized |
| **Health Check** | http://localhost:8080 | Tomcat default page |
| **Database** | localhost:5432 | PostgreSQL listening |

---

## 🛠️ Development Commands

### Backend
```bash
# Clean and build
mvn clean install

# Run tests
mvn test

# Package for production
mvn clean package -DskipTests

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"
```

### Frontend
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

---

## 📱 Important Endpoints for Testing

### Authentication
```bash
# Register
POST http://localhost:8080/api/auth/register

# Login
POST http://localhost:8080/api/auth/login

# Validate token
GET http://localhost:8080/api/auth/validate
```

### Users
```bash
# Get user profile
GET http://localhost:8080/api/users/{id}

# Get leaderboard
GET http://localhost:8080/api/users/{id}/leaderboard-rank
```

### Jobs
```bash
# Get all jobs
GET http://localhost:8080/api/jobs

# Create job (requires auth)
POST http://localhost:8080/api/jobs

# Get job details
GET http://localhost:8080/api/jobs/{id}
```

---

## 🎯 Next Steps After Running

1. ✅ Explore all features
2. ✅ Test with different user roles
3. ✅ Review [DEPLOYEMENT_READY.md](DEPLOYEMENT_READY.md) for production deployment
4. ✅ Read [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for all endpoints
5. ✅ Check [IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md) for feature checklist

---

## 🚀 Production Deployment

When ready to deploy:

1. Update configuration (passwords, secrets, CORS)
2. Build frontend: `npm run build`
3. Build backend: `mvn clean package -DskipTests`
4. Deploy to cloud (AWS, GCP, Azure, Heroku, etc.)
5. Follow [DEPLOYEMENT_READY.md](DEPLOYEMENT_READY.md) guide

---

## 📞 Support Resources

- **Troubleshooting**: [DEPLOYEMENT_READY.md](DEPLOYEMENT_READY.md) - Comprehensive guide
- **Features**: [IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md) - Feature checklist
- **API Reference**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - All endpoints
- **Project Structure**: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Overview

---

## ✨ Tips & Best Practices

### Development Tips
- Use browser DevTools (F12) to debug frontend
- Check backend logs in console for errors
- Keep terminals open to see real-time logs
- Use Postman/Insomnia for API testing

### Database Tips
- Query database with: `psql -U postgres -d zero2earn`
- Backup database regularly: `pg_dump -U postgres zero2earn > backup.sql`
- Monitor queries: `SELECT * FROM pg_stat_statements;`

### Security Tips
- Change JWT secret in production
- Use strong database passwords
- Enable HTTPS in production
- Validate all inputs (frontend & backend)

---

## ✅ Success Indicators

When everything is working correctly:

✅ Frontend loads at http://localhost:5173  
✅ Can login with test accounts  
✅ Dashboard displays user data  
✅ Can navigate all pages  
✅ API returns proper responses  
✅ Database queries work  
✅ Real-time chat functions  
✅ No console errors  

---

**🎉 You're ready to run Zero2Earn!**

Start with Step 1️⃣ above and work through all steps.

For issues, check the Troubleshooting section or review the comprehensive guides linked above.

---

**Built with ❤️ | April 2026**
