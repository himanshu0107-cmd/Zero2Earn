# Zero2Earn - Quick Start (5 Minutes)

## ⚡ Quick Setup

### Step 1: Start MySQL
```bash
# Ensure MySQL is running, then import database
mysql -u root -p zero2earn < backend/src/main/resources/database_schema.sql
```

### Step 2: Start Backend
```bash
cd backend
mvn spring-boot:run
```
✅ Backend ready at `http://localhost:8080/api`

### Step 3: Start Frontend
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend ready at `http://localhost:5173`

## 🔑 Login & Test

1. Go to `http://localhost:5173`
2. Click "Get Started"
3. Register with:
   - Username: `myuser`
   - Email: `myuser@example.com`
   - Password: `password123`
4. Explore dashboard, tasks, and leaderboard!

Or use test account:
- Email: `admin@zero2earn.com`
- Password: `admin123`

## 📊 What Can You Do?

✅ **Complete Tasks** - Earn coins for watching videos, sharing, reviewing  
✅ **Gain Followers** - Build your influence  
✅ **Climb Leaderboard** - Compete with other users  
✅ **Withdraw Earnings** - Convert coins to money  
✅ **Track Stats** - Dashboard shows all metrics  

## 🎯 API Endpoints Quick Reference

```
GET  /api/tasks              - Get all tasks
POST /api/user-tasks/complete - Complete task (need auth)
GET  /api/leaderboard/top/{n} - Get top N influencers
GET  /api/users/{id}         - Get user profile
```

## 🔧 Config Files

- Backend: `backend/src/main/resources/application.properties`
- Frontend: Create `.env.local` or use defaults

## ❓ Troubleshooting

| Issue | Solution |
|-------|----------|
| MySQL not found | Verify MySQL is installed and running |
| Port 8080 in use | Change port in application.properties |
| API errors | Check backend server is running on 8080 |
| Build fails | Run `mvn clean install` in backend folder |

## 📱 Browser Support

✅ Chrome/Edge  
✅ Firefox  
✅ Safari  
✅ Mobile browsers  

## 🎓 Next Steps

1. Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
2. Review [README.md](README.md) for full documentation
3. Check API responses in browser DevTools
4. Explore the code structure
5. Deploy to production when ready!

---

**You're all set! Start earning with Zero2Earn! 💰🚀**
