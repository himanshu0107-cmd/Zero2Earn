# Zero2Earn - Complete Setup Guide

## 📋 Prerequisites

Before starting, ensure you have:
- **Java Development Kit (JDK) 17+** → [Download](https://www.oracle.com/java/technologies/downloads/)
- **Apache Maven 3.6+** → [Download](https://maven.apache.org/download.cgi)
- **MySQL Server 8.0+** → [Download](https://dev.mysql.com/downloads/mysql/)
- **Node.js 16+ & npm** → [Download](https://nodejs.org/)
- **VS Code** (or any IDE)

## 🗄️ Step 1: Database Setup

### 1.1 Start MySQL Server
```bash
# Windows
net start MySQL80

# Mac
mysql.server start

# Linux
sudo service mysql start
```

### 1.2 Create Database
Open terminal and log in to MySQL:
```bash
mysql -u root -p
```
Enter your MySQL root password when prompted.

Then execute the schema file:
```bash
mysql -u root -p zero2earn < backend/src/main/resources/database_schema.sql
```

### 1.3 Verify Database
```bash
# In MySQL command line
USE zero2earn;
SHOW TABLES;

# You should see: users, tasks, user_tasks, leaderboard, withdrawals
```

## ⚙️ Step 2: Backend Setup (Spring Boot)

### 2.1 Update Database Credentials
Edit: `backend/src/main/resources/application.properties`

```properties
# MySQL Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/zero2earn?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 2.2 Build Backend
```bash
cd backend
mvn clean install
```

This will download dependencies and build the Spring Boot JAR.

### 2.3 Run Backend Server
```bash
mvn spring-boot:run
```

Or run the JAR directly:
```bash
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

**Expected Output:**
```
Started Zero2EarnApplication in X.XXX seconds
Server started on port 8080
```

### 2.4 Test Backend
Open browser: `http://localhost:8080/api/status`

You should see:
```json
{
  "status": "success",
  "message": "Zero2Earn API is running!",
  "version": "1.0.0"
}
```

## 🎨 Step 3: Frontend Setup (React + Vite)

### 3.1 Install Dependencies
```bash
cd frontend
npm install
```

### 3.2 Configure API URL
Create `.env.local` file in frontend root:
```
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=Zero2Earn
```

### 3.3 Start Development Server
```bash
npm run dev
```

**Expected Output:**
```
VITE vX.X.X ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

## ✅ Testing the Application

### 3.1 Open Application
Navigate to: `http://localhost:5173/`

### 3.2 Test Registration
1. Click "Get Started" button
2. Go to "Sign in" page
3. Click "Create a new account"
4. Fill in:
   - Username: `test_user`
   - Email: `test@example.com`
   - Password: `password123`
5. Click "Create Account"

### 3.3 Test Dashboard
After login, you should see:
- Your username in navbar
- Dashboard with stats (Followers, Earnings, Coins)
- Available tasks to complete

### 3.4 Test Task Completion
1. Go to "Tasks" page
2. View available tasks
3. Click "Complete Task" button
4. Check dashboard for updated earnings

### 3.5 Test Leaderboard
1. Go to "Leaderboard" page
2. View top influencers
3. Switch between "Most Followers" and "Highest Earners"

## 🔧 Troubleshooting

### Backend Issues

**Error: MySQL Connection Failed**
- Check MySQL is running
- Verify credentials in application.properties
- Ensure database exists: `CREATE DATABASE zero2earn;`

**Error: Port 8080 Already in Use**
```bash
# Change port in application.properties
server.port=8081
```

**Error: Maven Not Found**
```bash
# Add Maven to PATH
# Windows: Add C:\apache-maven-3.X.X\bin to PATH environment variable
# Mac/Linux: brew install maven
```

### Frontend Issues

**Error: Cannot find module 'react'**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Error: API Connection Failed**
- Check `.env.local` file exists
- Verify API URL: `http://localhost:8080/api`
- Ensure backend server is running

**Error: Port 5173 Already in Use**
```bash
npm run dev -- --port 3000
```

## 📱 Frontend Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with features |
| Login | `/login` | Register/Login page |
| Dashboard | `/dashboard` | User stats and profile |
| Tasks | `/services` | Browse available tasks |
| Task Details | `/services/:id` | Task information |
| Leaderboard | `/leaderboard` | Rankings page |

## 🔐 Test Accounts

### Admin Account
- Email: `admin@zero2earn.com`
- Password: `admin123`

### Sample Users
- Username: `john_influencer` / Password: `password123`
- Username: `sarah_creator` / Password: `password123`
- Username: `emma_vlogger` / Password: `password123`

## 📊 API Testing

Use Postman or cURL to test APIs:

```bash
# Get all active tasks
curl http://localhost:8080/api/tasks

# Complete a task (replace userID and taskID)
curl -X POST http://localhost:8080/api/user-tasks/complete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d "userId=1&taskId=1"

# Get leaderboard
curl http://localhost:8080/api/leaderboard/top/10
```

## 🚀 Production Deployment

### Backend (AWS/Heroku)
1. Package: `mvn clean package`
2. Upload JAR to server
3. Set environment variables for MySQL
4. Run: `java -jar backend.jar`

### Frontend (Netlify/Vercel)
1. Build: `npm run build`
2. Push `dist` folder
3. Set environment variables
4. Deploy

## 📝 Useful Commands

```bash
# Backend
mvn clean install          # Clean build
mvn spring-boot:run        # Run server
mvn test                   # Run tests

# Frontend
npm install               # Install packages
npm run dev               # Dev server
npm run build             # Production build
npm run preview           # Preview build
npm run lint              # Check code quality
```

## 🎓 Learning Resources

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [React Docs](https://react.dev)
- [MySQL Docs](https://dev.mysql.com/doc/)
- [JWT Guide](https://jwt.io/)

## 🆘 Need Help?

1. Check error messages in console
2. Review logs in browser DevTools (F12)
3. Check application.properties for configuration
4. Verify all prerequisites are installed
5. Ensure ports 8080 and 5173 are available

---

**Happy coding! 🚀** Start earning with Zero2Earn!
