# 🧪 Zero2Earn - Quick Testing Guide

## 🚀 Testing the Application

### Current Status
```
✅ Frontend:  http://localhost:5174
✅ Backend:   http://localhost:8080  
✅ Database:  H2 In-Memory (Active)
```

---

## 🎮 Manual Frontend Testing

### 1. Home Page
**URL**: http://localhost:5174
- [ ] Hero section visible
- [ ] Feature cards displaying
- [ ] Statistics showing (1000+ users, 5000+ tasks, $50K+ paid out)
- [ ] "Get Started" button visible
- [ ] Navigation bar at top

### 2. Navigation
- [ ] Home link clickable
- [ ] Tasks link clickable  
- [ ] Leaderboard link clickable
- [ ] Sign In button visible
- [ ] Mobile menu responsive

### 3. Tasks Page
**URL**: http://localhost:5174/services
- [ ] Task list loading
- [ ] Task cards displaying with:
  - [ ] Task title
  - [ ] Description
  - [ ] Reward coins badge
  - [ ] Task type indicator
- [ ] Filter buttons showing all task types
- [ ] No errors in console

### 4. Leaderboard Page
**URL**: http://localhost:5174/leaderboard
- [ ] User rankings displaying
- [ ] Top 10 users visible
- [ ] Followers column showing
- [ ] Earnings column showing
- [ ] Sort options working

### 5. Login/Registration
**URL**: http://localhost:5174/login
- [ ] Toggle between "Sign In" and "Join Now"
- [ ] Form fields visible (email, password, username for signup)
- [ ] Form validation placeholder text showing
- [ ] Buttons responsive

---

## 🔌 Manual Backend API Testing

### Using curl or Postman

#### 1. Register User
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```
**Expected**: 200 OK with JWT token

#### 2. Login
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```
**Expected**: 200 OK with JWT token and user data

#### 3. Get All Tasks
```bash
GET http://localhost:8080/api/tasks
```
**Expected**: 200 OK with task array

#### 4. Get Leaderboard
```bash
GET http://localhost:8080/api/leaderboard/top
```
**Expected**: 200 OK with top 10 users

#### 5. Get User
```bash
GET http://localhost:8080/api/users/1
```
**Expected**: 200 OK with user data

#### 6. Get Tasks by Type
```bash
GET http://localhost:8080/api/tasks/type/video
```
**Expected**: 200 OK with filtered tasks

---

## 🗄️ Database Testing

### H2 Console
**URL**: http://localhost:8080/h2-console
- [ ] Console accessible
- [ ] Connection string: `jdbc:h2:mem:zero2earn`
- [ ] Username: `sa` (no password)

### Check Tables
```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'PUBLIC';
```

Should show:
- `USERS`
- `TASKS`
- `USER_TASKS`
- `WITHDRAWALS`
- `LEADERBOARD`

### Check Data
```sql
SELECT * FROM USERS;
SELECT * FROM TASKS;
SELECT * FROM LEADERBOARD;
```

---

## 🔐 Authentication Testing

### Test JWT Token

1. Register a user and copy the JWT token from response
2. Use token in header for authenticated requests:
```bash
GET http://localhost:8080/api/users/1
Authorization: Bearer {your_jwt_token}
```

### Token should include:
- User ID
- Username
- Email
- Expiration (24 hours)

---

## 📊 Feature Testing Checklist

- [ ] **User Management**
  - [ ] Can register new user
  - [ ] Can login with credentials
  - [ ] JWT token issued correctly
  - [ ] Can view user profile

- [ ] **Task System**
  - [ ] Can fetch all tasks
  - [ ] Can filter tasks by type
  - [ ] Can view single task
  - [ ] Tasks have correct coin rewards

- [ ] **Leaderboard**
  - [ ] Users ranked by followers
  - [ ] Users ranked by earnings
  - [ ] Top 10 accessible
  - [ ] Data consistent

- [ ] **Responsive Design**
  - [ ] Mobile layout (375px)
  - [ ] Tablet layout (768px)
  - [ ] Desktop layout (1920px)
  - [ ] Navigation responsive

- [ ] **Styling**
  - [ ] Colors consistent (indigo/purple theme)
  - [ ] Gradients displaying
  - [ ] Animations smooth
  - [ ] Fonts readable

---

## 🐛 Debugging Tips

### Frontend Issues
1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for API calls
4. Check local storage for auth token

### Commands
```bash
# Frontend only
cd frontend
npm run dev

# Backend only
cd backend
mvn spring-boot:run

# Kill processes
taskkill /PID {process_id} /F
```

### Common Issues
- **CORS Error**: Backend CORS configured, should be resolved
- **404 Errors**: Check backend port (8080) and API routes
- **Blank Page**: Check frontend port (5174 or 5173)
- **Token Expired**: Tokens valid for 24 hours

---

## 📈 Performance Testing

### Quick Load Tests
```bash
# Test endpoint response time
time curl -X GET http://localhost:8080/api/tasks

# Test with multiple requests
for i in {1..100}; do
  curl -s http://localhost:8080/api/tasks > /dev/null
done
```

---

## 🎯 Test Scenarios

### Scenario 1: New User Registration
1. Click "Get Started" on home page
2. Go to login page
3. Click "Join Now"
4. Fill registration form
5. Submit
6. View dashboard

### Scenario 2: Browse Tasks
1. Go to Tasks page (/services)
2. View all tasks loading
3. Click filter by type
4. View filtered results
5. View task details

### Scenario 3: Check Leaderboard
1. Go to Leaderboard page
2. See top performers
3. Sort by different metrics
4. Verify rankings accurate

---

## ✅ Final Verification

Run this checklist:
- [ ] Frontend loads without errors
- [ ] All pages accessible
- [ ] Navigation works
- [ ] Backend API responding
- [ ] Database tables created
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Tasks load properly
- [ ] Leaderboard displays
- [ ] Styling consistent

---

## 📞 Support

### Logs to Check
- Frontend: Browser Console (F12)
- Backend: Terminal output
- Database: H2 Console queries

### Endpoints Summary
| Feature | GET | POST | PUT | DELETE |
|---------|-----|------|-----|--------|
| Tasks | ✅ | ✅ | ✅ | ✅ |
| Users | ✅ | - | ✅ | - |
| Auth | - | ✅ | - | - |
| Leaderboard | ✅ | - | - | - |
| Withdrawals | ✅ | ✅ | ✅ | - |

---

**Testing Date**: April 3, 2026  
**Application Version**: 1.0.0  
**Status**: Ready for testing ✅
