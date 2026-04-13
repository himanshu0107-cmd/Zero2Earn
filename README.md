# ⚡ Zero2Earn — Campus Freelancing Platform

> A full-stack student freelancing ecosystem for Indian colleges. Students find tasks, apply, earn money, chat in real-time, and upskill through a course marketplace.

---

## 🏗 Tech Stack

| Layer      | Technology                                   |
|------------|----------------------------------------------|
| Frontend   | React 18 + Vite + React Router + Axios       |
| Backend    | Java 21 + Spring Boot 3.2                    |
| Database   | MySQL 8+                                     |
| DB Access  | Spring JDBC (JdbcTemplate) — **no ORM/JPA**  |
| Auth       | JWT (jjwt 0.11.5) + BCrypt                   |
| Real-time  | WebSocket / STOMP + SockJS                   |
| Styling    | Vanilla CSS (custom dark design system)      |

---

## 📁 Project Structure

```
Zero2Earn/
├── backend/
│   ├── src/main/java/com/zero2earn/
│   │   ├── config/         # SecurityConfig, WebSocketConfig, GlobalExceptionHandler
│   │   ├── controller/     # AuthController, UserController, JobController,
│   │   │                   # ApplicationController, ChatController, CourseController,
│   │   │                   # ReviewController, SkillController, AdminController
│   │   ├── dto/            # RegisterRequest, LoginRequest, ApiResponse
│   │   ├── model/          # User, Job, Application, Message, Conversation,
│   │   │                   # Course, Review (pure POJOs — no JPA annotations)
│   │   ├── repository/     # UserDao, JobDao, ApplicationDao, MessageDao,
│   │   │                   # CourseDao, ReviewDao (JdbcTemplate)
│   │   ├── security/       # JwtUtil, JwtAuthFilter
│   │   └── service/        # AuthService, JobService, ApplicationService,
│   │                       # NotificationService
│   └── src/main/resources/
│       ├── application.properties
│       └── database_schema.sql
│
└── frontend/
    ├── src/
    │   ├── components/     # Navbar, JobCard, ProtectedRoute
    │   ├── context/        # AuthContext
    │   ├── pages/          # Home, Login, Dashboard, JobFeed, JobDetail,
    │   │                   # PostJob, Profile, Chat, Courses, CourseDetail, Leaderboard
    │   └── services/       # api.js (Axios)
    ├── .env
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Local Setup

### Prerequisites

- **Java 21** (JDK) — `java -version`
- **Maven 3.8+** — `mvn -version`
- **Node.js 18+** — `node -v`
- **MySQL 8+** running locally

---

### Step 1 — Database Setup

Open MySQL shell or MySQL Workbench:

```sql
CREATE DATABASE zero2earn
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE zero2earn;

SOURCE d:/Desktop/Zero2Earn/backend/src/main/resources/database_schema.sql;
```

Verify seed data:
```sql
SELECT id, name, role FROM users;
SELECT id, title, status FROM jobs;
```

---

### Step 2 — Backend Config

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/zero2earn?useSSL=false&serverTimezone=Asia/Kolkata&allowPublicKeyRetrieval=true
spring.datasource.username=root      # ← your MySQL username
spring.datasource.password=root      # ← your MySQL password
```

---

### Step 3 — Start Backend

```bash
cd d:/Desktop/Zero2Earn/backend
mvn clean install -DskipTests
mvn spring-boot:run
```

Backend starts on **http://localhost:8080**

Verify:
```
GET http://localhost:8080/api/jobs      → should return job list
GET http://localhost:8080/api/skills   → should return skills catalog
```

---

### Step 4 — Start Frontend

```bash
cd d:/Desktop/Zero2Earn/frontend
npm install
npm run dev
```

Frontend starts on **http://localhost:5173**

---

### Step 5 — Open in Browser

Navigate to: **http://localhost:5173**

#### Demo Accounts

| Role    | Email                  | Password   |
|---------|------------------------|------------|
| Admin   | admin@zero2earn.in     | Test@1234  |
| Student | rahul@mitpune.edu      | Test@1234  |
| Teacher | neha@mitpune.edu       | Test@1234  |
| Student | priya@iitb.ac.in       | Test@1234  |
| Student | arjun@vit.ac.in        | Test@1234  |

---

## 📡 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint           | Auth | Description           |
|--------|--------------------|------|-----------------------|
| POST   | `/register`        | No   | Register new user     |
| POST   | `/login`           | No   | Login, returns JWT    |
| GET    | `/validate`        | JWT  | Validate current token|

### Users (`/api/users`)
| Method | Endpoint                        | Auth  | Description             |
|--------|---------------------------------|-------|-------------------------|
| GET    | `/{id}/profile`                 | No    | Get user + skills + reviews |
| PUT    | `/{id}/profile`                 | Owner | Update profile          |
| POST   | `/{id}/skills`                  | Owner | Add skill               |
| DELETE | `/{id}/skills/{skillId}`        | Owner | Remove skill            |
| GET    | `/leaderboard?limit=10`         | No    | Top users by XP         |
| GET    | `/{id}/notifications`           | Owner | Get notifications       |
| PUT    | `/{id}/notifications/read`      | Owner | Mark all as read        |

### Jobs (`/api/jobs`)
| Method | Endpoint                      | Auth     | Description                   |
|--------|-------------------------------|----------|-------------------------------|
| GET    | `/`                           | No       | Browse jobs (filter + paging) |
| GET    | `/recommended`                | JWT      | Skill-matched jobs            |
| GET    | `/{id}`                       | No       | Job detail                    |
| GET    | `/search?q=keyword`           | No       | Search jobs                   |
| GET    | `/my`                         | JWT      | My posted jobs                |
| POST   | `/`                           | JWT      | Create job                    |
| PATCH  | `/{id}/status`                | JWT      | Update job status             |

### Applications (`/api/applications`)
| Method | Endpoint              | Auth    | Description                         |
|--------|-----------------------|---------|-------------------------------------|
| POST   | `/`                   | JWT     | Apply to a job                      |
| GET    | `/job/{jobId}`        | Poster  | View applicants for a job           |
| GET    | `/my`                 | JWT     | My applications                     |
| PATCH  | `/{id}/status`        | JWT     | Accept / Reject / Complete / Withdraw|

### Chat (`/api/chat`)
| Method | Endpoint                           | Auth | Description              |
|--------|------------------------------------|------|--------------------------|
| POST   | `/conversation`                    | JWT  | Get or create chat room  |
| GET    | `/conversations`                   | JWT  | All my conversations     |
| GET    | `/conversation/{id}/messages`      | JWT  | Load messages (paged)    |
| POST   | `/conversation/{id}/messages`      | JWT  | Send message (REST)      |
| WS     | `/ws` → `/app/chat.send`           | —    | Send message via STOMP   |
| WS     | `/ws` → `/topic/chat/{convId}`     | —    | Subscribe to room        |

### Courses (`/api/courses`)
| Method | Endpoint              | Auth       | Description              |
|--------|-----------------------|------------|--------------------------|
| GET    | `/`                   | No         | Browse published courses |
| GET    | `/{id}`               | No         | Course detail            |
| POST   | `/`                   | JWT        | Create course            |
| POST   | `/{id}/enroll`        | JWT        | Enroll in course         |
| PATCH  | `/{id}/progress`      | JWT        | Update progress %        |
| GET    | `/my-courses`         | JWT        | My enrolled courses      |

### Reviews (`/api/reviews`)
| Method | Endpoint         | Auth | Description                    |
|--------|------------------|------|--------------------------------|
| POST   | `/`              | JWT  | Submit a review (1-5 stars)    |
| GET    | `/user/{userId}` | No   | Get reviews for a user         |

### Skills (`/api/skills`)
| Method | Endpoint       | Auth | Description       |
|--------|----------------|------|-------------------|
| GET    | `/`            | No   | All skills        |
| GET    | `/categories`  | No   | Distinct categories|

### Admin (`/api/admin`) — requires `ADMIN` role
| Method | Endpoint                        | Description             |
|--------|---------------------------------|-------------------------|
| GET    | `/stats`                        | Platform statistics     |
| GET    | `/users?page=0`                 | All users (paginated)   |
| PATCH  | `/users/{id}/toggle-active`     | Disable / enable user   |

---

## 🎮 Features Walkthrough

1. **Register** → choose role → auto-gets JWT
2. **Browse Jobs** → filter by type / remote / budget
3. **Apply** → cover letter + quote + estimated days
4. **Poster** sees applicants → Accept or Reject
5. **Chat** with poster/applicant in real-time (WebSocket)
6. **Completed** → both parties can rate each other ⭐
7. **XP** earned for: applying (+10), posting (+20), completing (+100)
8. **Leaderboard** → compete with your college peers
9. **Courses** → enroll + track progress (0 → 100%)
10. **Dashboard** → recommended jobs, active apps, my courses

---

## 🔒 Security Notes

- Passwords hashed with **BCrypt** (strength 12)
- JWT signed with **HMAC-SHA256**, expires in 24 hours
- All protected endpoints validate token via `JwtAuthFilter`
- Role-based access: `ADMIN` routes locked via `@PreAuthorize`
- CORS configured to only allow `localhost:5173` (update for production)
- Input validated with **Bean Validation** (`@Valid`, `@NotBlank`, etc.)

---

## ⚠️ Troubleshooting

| Issue | Fix |
|-------|-----|
| `Access denied` on MySQL | Change `spring.datasource.password` in `application.properties` |
| `Port 8080 already in use` | Kill process: `netstat -ano \| findstr :8080` then `taskkill /PID <pid>` |
| `CORS error` in browser | Ensure frontend runs on `5173` and backend CORS allows it |
| `sockjs-client` not found | Run `npm install` in `/frontend` first |
| Build fails — Java version | Ensure `JAVA_HOME` points to JDK 21 |
| WebSocket won't connect | Backend must be running before frontend starts |

---

## 🗺 Roadmap (Next Features)

- [ ] Email verification on register
- [ ] File upload (profile pictures, task attachments)
- [ ] Payment gateway integration (Razorpay)
- [ ] Admin analytics dashboard
- [ ] Mobile app (React Native)
- [ ] College administrator portal
- [ ] AI-powered job recommendation (collaborative filtering)

---

*Built with ❤️ for Indian college students. Zero2Earn — Turn Skills Into Earnings.*
