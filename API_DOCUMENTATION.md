# Zero2Earn - API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Endpoints by Category

### 🔐 Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "username": "john_user",
  "email": "john@example.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "user": {
      "id": 1,
      "username": "john_user",
      "email": "john@example.com",
      "followers": 0,
      "earnings": 0.00,
      "isAdmin": false
    }
  }
}
```

#### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "user": { ... }
  }
}
```

#### Validate Token
```
GET /auth/validate
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Token valid",
  "data": { user object }
}
```

---

### 👤 User Endpoints

#### Get All Users
```
GET /users

Response 200:
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": 1,
      "username": "john",
      "email": "john@example.com",
      "followers": 150,
      "earnings": 250.50
    }
  ]
}
```

#### Get User by ID
```
GET /users/{id}

Response 200:
{
  "success": true,
  "data": { user object }
}
```

#### Get by Email
```
GET /users/email/{email}

Response 200:
{
  "success": true,
  "data": { user object }
}
```

#### Update Profile
```
PUT /users/{id}/profile?bio=New bio&profilePictureUrl=http://...
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { updated user }
}
```

---

### 📋 Task Endpoints

#### Get Active Tasks
```
GET /tasks

Response 200:
{
  "success": true,
  "message": "Tasks fetched successfully",
  "data": [
    {
      "id": 1,
      "title": "Watch Product Video",
      "description": "Watch a 5-minute product review",
      "rewardCoins": 10,
      "taskType": "video",
      "status": "active"
    }
  ]
}
```

#### Get All Tasks (including inactive)
```
GET /tasks/all

Response 200: { same as above }
```

#### Get Task by ID
```
GET /tasks/{id}

Response 200:
{
  "success": true,
  "data": { task object }
}
```

#### Get Tasks by Type
```
GET /tasks/type/{taskType}
Options: video, share, review, referral, survey, education, content

Response 200: { array of tasks }
```

#### Create Task (Admin)
```
POST /tasks?title=...&description=...&rewardCoins=10&taskType=video
Authorization: Bearer {admin_token}

Response 200:
{
  "success": true,
  "message": "Task created successfully",
  "data": { new task }
}
```

#### Update Task (Admin)
```
PUT /tasks/{id}?title=...&description=...&rewardCoins=15&status=active
Authorization: Bearer {admin_token}

Response 200:
{
  "success": true,
  "message": "Task updated successfully",
  "data": { updated task }
}
```

#### Delete Task (Admin)
```
DELETE /tasks/{id}
Authorization: Bearer {admin_token}

Response 200:
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

### ✅ User Task Endpoints

#### Get User's Tasks
```
GET /user-tasks/user/{userId}

Response 200:
{
  "success": true,
  "message": "User tasks fetched successfully",
  "data": [
    {
      "id": 1,
      "user": { user object },
      "task": { task object },
      "status": "completed",
      "completedAt": "2024-04-03T10:30:00"
    }
  ]
}
```

#### Get Completed Tasks
```
GET /user-tasks/user/{userId}/completed

Response 200: { array of completed tasks }
```

#### Get Pending Tasks
```
GET /user-tasks/user/{userId}/pending

Response 200: { array of pending tasks }
```

#### Assign Task to User
```
POST /user-tasks/assign?userId=1&taskId=1
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Task assigned successfully",
  "data": { user_task object }
}
```

#### Complete Task
```
POST /user-tasks/complete?userId=1&taskId=1
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Task completed successfully and earnings awarded",
  "data": { updated user_task }
}
```

---

### 🏆 Leaderboard Endpoints

#### Get Leaderboard by Followers
```
GET /leaderboard/followers

Response 200:
{
  "success": true,
  "message": "Leaderboard fetched successfully",
  "data": [
    {
      "rank": 1,
      "username": "emma_vlogger",
      "followers": 450,
      "earnings": 980.25
    }
  ]
}
```

#### Get Leaderboard by Earnings
```
GET /leaderboard/earnings

Response 200: { sorted by earnings }
```

#### Get Top N Influencers
```
GET /leaderboard/top/{limit}

Response 200: { top limit influencers }
```

#### Get Top 10 (Quick)
```
GET /leaderboard/top

Response 200: { top 10 influencers }
```

---

### 💳 Withdrawal Endpoints

#### Request Withdrawal
```
POST /withdrawals/request?userId=1&amount=50.00
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Withdrawal request submitted successfully",
  "data": {
    "id": 1,
    "amount": 50.00,
    "status": "pending",
    "requestedAt": "2024-04-03T10:30:00"
  }
}
```

#### Get User's Withdrawals
```
GET /withdrawals/user/{userId}

Response 200:
{
  "success": true,
  "message": "Withdrawals fetched successfully",
  "data": [ { withdrawal objects } ]
}
```

#### Get Pending Withdrawals (Admin)
```
GET /withdrawals/pending
Authorization: Bearer {admin_token}

Response 200: { array of pending withdrawals }
```

#### Approve Withdrawal (Admin)
```
PUT /withdrawals/{withdrawalId}/approve
Authorization: Bearer {admin_token}

Response 200:
{
  "success": true,
  "message": "Withdrawal approved successfully",
  "data": { updated withdrawal with status: "completed" }
}
```

#### Reject Withdrawal (Admin)
```
PUT /withdrawals/{withdrawalId}/reject
Authorization: Bearer {admin_token}

Response 200:
{
  "success": true,
  "message": "Withdrawal rejected successfully",
  "data": { updated withdrawal with status: "failed" }
}
```

---

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

### Common HTTP Status Codes
- `200` OK - Request successful
- `400` Bad Request - Invalid parameters
- `401` Unauthorized - Missing/invalid token
- `403` Forbidden - Not authorized for action
- `404` Not Found - Resource doesn't exist
- `500` Internal Server Error - Server error

---

## Request Headers

```
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

## Rate Limiting
Currently no rate limiting. Implement for production.

## Testing APIs

### Using cURL
```bash
# Get tasks
curl http://localhost:8080/api/tasks

# Complete task
curl -X POST http://localhost:8080/api/user-tasks/complete \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "taskId": 1}'
```

### Using Postman
1. Import the base URL
2. Add JWT token to Authorization header
3. Test each endpoint

---

## Data Types

| Type | Format |
|------|--------|
| String | "text" |
| Integer | 0-9 numeric |
| BigDecimal | 123.45 |
| LocalDateTime | "2024-04-03T10:30:00" |
| Boolean | true/false |

---

## Pagination
Not yet implemented. Add for production with `limit` and `offset` parameters.

## Sorting
Not yet implemented. Add `sort` parameter for production.

---

## Key Points

✅ All timestamps are in UTC  
✅ Amounts are in USD  
✅ JWT tokens expire in 24 hours  
✅ Passwords are hashed with BCrypt  
✅ CORS enabled for frontend communication  

---

**Version:** 1.0.0  
**Last Updated:** April 3, 2024
