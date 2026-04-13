-- ============================================================
-- Zero2Earn — PostgreSQL Schema
-- Run in psql shell:
--
--   Step 1 (in psql as superuser):
--   CREATE DATABASE zero2earn;
--   \c zero2earn
--
--   Step 2 (run this file):
--   \i 'D:/Desktop/Zero2Earn/backend/src/main/resources/schema_postgres.sql'
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── Drop existing tables (clean slate) ──────────────────────
DROP TABLE IF EXISTS notifications, enrollments, reviews, messages,
                     conversations, applications, job_skills, jobs,
                     user_skills, courses, skills, users, colleges CASCADE;

-- ─── Colleges ────────────────────────────────────────────────
CREATE TABLE colleges (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(200) NOT NULL,
    city       VARCHAR(100),
    state      VARCHAR(100),
    logo_url   VARCHAR(500),
    verified   BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Users ───────────────────────────────────────────────────
CREATE TABLE users (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(150) NOT NULL,
    username       VARCHAR(50)  NOT NULL UNIQUE,
    email          VARCHAR(200) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    role           VARCHAR(20)  DEFAULT 'STUDENT'
                   CHECK (role IN ('STUDENT','TEACHER','ADMIN')),
    college_id     INT REFERENCES colleges(id) ON DELETE SET NULL,
    bio            TEXT,
    avatar_url     VARCHAR(500),
    phone          VARCHAR(20),
    xp             INT DEFAULT 0,
    rating         NUMERIC(3,2) DEFAULT 0.00,
    rating_count   INT DEFAULT 0,
    wallet_balance NUMERIC(12,2) DEFAULT 0.00,
    active         BOOLEAN DEFAULT TRUE,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Skills ──────────────────────────────────────────────────
CREATE TABLE skills (
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) DEFAULT 'General'
);

-- ─── User ↔ Skills ───────────────────────────────────────────
CREATE TABLE user_skills (
    user_id     INT NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
    skill_id    INT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency VARCHAR(20) DEFAULT 'Beginner'
                CHECK (proficiency IN ('Beginner','Intermediate','Expert')),
    PRIMARY KEY (user_id, skill_id)
);

-- ─── Jobs ────────────────────────────────────────────────────
CREATE TABLE jobs (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    poster_id   INT NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    college_id  INT          REFERENCES colleges(id) ON DELETE SET NULL,
    type        VARCHAR(20)  DEFAULT 'PAID'
                CHECK (type IN ('PAID','UNPAID','INTERNSHIP')),
    budget      NUMERIC(12,2),
    currency    VARCHAR(10)  DEFAULT 'INR',
    deadline    DATE,
    status      VARCHAR(20)  DEFAULT 'OPEN'
                CHECK (status IN ('OPEN','IN_PROGRESS','COMPLETED','CANCELLED')),
    remote      BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Job ↔ Skills ────────────────────────────────────────────
CREATE TABLE job_skills (
    job_id   INT NOT NULL REFERENCES jobs(id)   ON DELETE CASCADE,
    skill_id INT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, skill_id)
);

-- ─── Applications ────────────────────────────────────────────
CREATE TABLE applications (
    id              SERIAL PRIMARY KEY,
    job_id          INT NOT NULL REFERENCES jobs(id)  ON DELETE CASCADE,
    applicant_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_letter    TEXT,
    proposed_budget NUMERIC(12,2),
    estimated_days  INT,
    status          VARCHAR(20) DEFAULT 'PENDING'
                    CHECK (status IN ('PENDING','ACCEPTED','REJECTED','COMPLETED','WITHDRAWN')),
    applied_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (job_id, applicant_id)
);

-- ─── Reviews ─────────────────────────────────────────────────
CREATE TABLE reviews (
    id          SERIAL PRIMARY KEY,
    job_id      INT NOT NULL REFERENCES jobs(id)  ON DELETE CASCADE,
    reviewer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (job_id, reviewer_id)
);

-- ─── Conversations ───────────────────────────────────────────
CREATE TABLE conversations (
    id              SERIAL PRIMARY KEY,
    participant_1   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    participant_2   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id          INT          REFERENCES jobs(id)  ON DELETE SET NULL,
    last_message    TEXT,
    last_message_at TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (participant_1, participant_2)
);

-- ─── Messages ────────────────────────────────────────────────
CREATE TABLE messages (
    id              SERIAL PRIMARY KEY,
    conversation_id INT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id       INT NOT NULL REFERENCES users(id)         ON DELETE CASCADE,
    content         TEXT,
    msg_type        VARCHAR(10) DEFAULT 'TEXT'
                    CHECK (msg_type IN ('TEXT','FILE','IMAGE')),
    file_url        VARCHAR(500),
    sent_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at         TIMESTAMP
);

-- ─── Courses ─────────────────────────────────────────────────
CREATE TABLE courses (
    id             SERIAL PRIMARY KEY,
    title          VARCHAR(300) NOT NULL,
    description    TEXT,
    instructor_id  INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    price          NUMERIC(10,2) DEFAULT 0.00,
    currency       VARCHAR(10)   DEFAULT 'INR',
    thumbnail_url  VARCHAR(500),
    category       VARCHAR(100)  DEFAULT 'General',
    duration_hours INT DEFAULT 0,
    difficulty     VARCHAR(20)   DEFAULT 'Beginner'
                   CHECK (difficulty IN ('Beginner','Intermediate','Advanced')),
    status         VARCHAR(20)   DEFAULT 'PUBLISHED'
                   CHECK (status IN ('DRAFT','PUBLISHED','ARCHIVED')),
    rating         NUMERIC(3,2)  DEFAULT 0.00,
    enrolled_count INT DEFAULT 0,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Enrollments ─────────────────────────────────────────────
CREATE TABLE enrollments (
    id           SERIAL PRIMARY KEY,
    user_id      INT NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
    course_id    INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    progress_pct INT DEFAULT 0,
    enrolled_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE (user_id, course_id)
);

-- ─── Notifications ───────────────────────────────────────────
CREATE TABLE notifications (
    id         SERIAL PRIMARY KEY,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type       VARCHAR(50),
    title      VARCHAR(200),
    message    TEXT,
    read_flag  BOOLEAN DEFAULT FALSE,
    ref_id     INT,
    ref_type   VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX idx_jobs_status    ON jobs(status);
CREATE INDEX idx_jobs_poster    ON jobs(poster_id);
CREATE INDEX idx_apps_job       ON applications(job_id);
CREATE INDEX idx_apps_applicant ON applications(applicant_id);
CREATE INDEX idx_msgs_conv      ON messages(conversation_id);
CREATE INDEX idx_notifs_user    ON notifications(user_id, read_flag);
CREATE INDEX idx_users_email    ON users(email);

-- ============================================================
-- SEED DATA  (BCrypt of "Test@1234")
-- ============================================================

INSERT INTO colleges (id, name, city, state, verified) VALUES
(1, 'MIT Pune',   'Pune',   'Maharashtra', TRUE),
(2, 'IIT Bombay', 'Mumbai', 'Maharashtra', TRUE),
(3, 'VIT Vellore','Vellore','Tamil Nadu',  TRUE),
(4, 'BITS Pilani','Pilani', 'Rajasthan',   TRUE),
(5, 'NIT Trichy', 'Tiruchirappalli','Tamil Nadu', TRUE);

INSERT INTO users (id, name, username, email, password_hash, role, college_id, bio, xp) VALUES
(1, 'Admin User',      'admin',     'admin@zero2earn.in',
 '$2a$12$jN5H3T7O8lQ2K4FzYpW.sO1xVcZ5t2CmN9R7aD0eG6wL8yU3mP4Ki',
 'ADMIN', NULL, 'Platform administrator', 9999),
(2, 'Rahul Sharma',    'rahul_s',   'rahul@mitpune.edu',
 '$2a$12$jN5H3T7O8lQ2K4FzYpW.sO1xVcZ5t2CmN9R7aD0eG6wL8yU3mP4Ki',
 'STUDENT', 1, 'Full-stack dev & ML enthusiast.', 320),
(3, 'Prof. Neha Joshi','prof_neha', 'neha@mitpune.edu',
 '$2a$12$jN5H3T7O8lQ2K4FzYpW.sO1xVcZ5t2CmN9R7aD0eG6wL8yU3mP4Ki',
 'TEACHER', 1, 'Professor of CS at MIT Pune.', 150),
(4, 'Priya Verma',     'priyav',    'priya@iitb.ac.in',
 '$2a$12$jN5H3T7O8lQ2K4FzYpW.sO1xVcZ5t2CmN9R7aD0eG6wL8yU3mP4Ki',
 'STUDENT', 2, 'UI/UX designer & freelancer.', 210),
(5, 'Arjun Mehta',     'arjunm',    'arjun@vit.ac.in',
 '$2a$12$jN5H3T7O8lQ2K4FzYpW.sO1xVcZ5t2CmN9R7aD0eG6wL8yU3mP4Ki',
 'STUDENT', 3, 'Android & Flutter developer.', 180);

-- Reset sequences after manual ID inserts
SELECT setval('colleges_id_seq', (SELECT MAX(id) FROM colleges));
SELECT setval('users_id_seq',    (SELECT MAX(id) FROM users));

INSERT INTO skills (id, name, category) VALUES
(1,'React','Programming'),(2,'Node.js','Programming'),(3,'Python','Programming'),
(4,'Java','Programming'),(5,'Spring Boot','Programming'),(6,'MySQL','Programming'),
(7,'UI/UX Design','Design'),(8,'Figma','Design'),(9,'Graphic Design','Design'),
(10,'Machine Learning','AI/ML'),(11,'Data Science','AI/ML'),
(12,'Flutter','Mobile'),(13,'Android','Mobile'),
(14,'Content Writing','Writing'),(15,'Digital Marketing','Marketing'),
(16,'Video Editing','Media'),(17,'Photography','Media'),
(18,'Excel / Sheets','General'),(19,'Canva','Design'),(20,'TypeScript','Programming');
SELECT setval('skills_id_seq', (SELECT MAX(id) FROM skills));

INSERT INTO user_skills (user_id, skill_id, proficiency) VALUES
(2,1,'Expert'),(2,3,'Intermediate'),(2,10,'Beginner'),
(3,5,'Expert'),(3,4,'Expert'),
(4,7,'Expert'),(4,8,'Expert'),(4,9,'Intermediate'),
(5,12,'Expert'),(5,13,'Expert'),(5,4,'Intermediate');

INSERT INTO jobs (id, title, description, poster_id, college_id, type, budget, deadline, status, remote) VALUES
(1,'Build a React Portfolio Website',
 'Need a clean, modern portfolio website in React with dark theme, projects section, and contact form.',
 3,1,'PAID',3500.00,CURRENT_DATE + INTERVAL '14 days','OPEN',TRUE),
(2,'Design a Mobile App UI in Figma',
 '8-10 screens for a food delivery app with component library and prototype links.',
 3,1,'PAID',2500.00,CURRENT_DATE + INTERVAL '10 days','OPEN',TRUE),
(3,'Python Web Scraper for Research Data',
 'Scrape academic papers from two websites into CSV with pagination handling.',
 2,1,'PAID',1500.00,CURRENT_DATE + INTERVAL '7 days','OPEN',TRUE),
(4,'Content Writing — 5 Blog Articles',
 '5 SEO-friendly blog posts (800-1000 words each) on tech trends for students.',
 3,1,'PAID',2000.00,CURRENT_DATE + INTERVAL '21 days','OPEN',TRUE),
(5,'ML Model for Student Score Prediction',
 'Build scikit-learn regression model predicting exam scores. Volunteer project.',
 3,1,'UNPAID',NULL,CURRENT_DATE + INTERVAL '30 days','OPEN',TRUE),
(6,'Flutter App — College Event Manager',
 'Cross-platform Flutter app for college event management with Firebase.',
 3,NULL,'INTERNSHIP',NULL,CURRENT_DATE + INTERVAL '60 days','OPEN',FALSE);
SELECT setval('jobs_id_seq', (SELECT MAX(id) FROM jobs));

INSERT INTO job_skills VALUES
(1,1),(1,20),(2,7),(2,8),(3,3),(4,14),(5,3),(5,10),(5,11),(6,12),(6,13);

INSERT INTO courses (id,title,description,instructor_id,price,category,duration_hours,difficulty,status,enrolled_count) VALUES
(1,'React Zero to Hero','Build full production apps with React, hooks, Context, React Router.',3,999.00,'Programming',20,'Beginner','PUBLISHED',145),
(2,'UI/UX Design with Figma','Master Figma with components, variants, auto-layout, and prototyping.',4,799.00,'Design',15,'Beginner','PUBLISHED',98),
(3,'Python for Data Science','NumPy, Pandas, Matplotlib, Scikit-learn with 5 real-world projects.',2,599.00,'AI/ML',25,'Intermediate','PUBLISHED',212),
(4,'Spring Boot Masterclass','REST APIs with Spring Boot, Security, JDBC, MySQL, and Docker.',3,1299.00,'Programming',30,'Intermediate','PUBLISHED',67),
(5,'Flutter App Development','Cross-platform mobile apps with Flutter, Dart, and Firebase.',5,899.00,'Mobile',22,'Beginner','PUBLISHED',89),
(6,'Digital Marketing Basics','SEO, social media, email campaigns, and Google Ads fundamentals.',3,0.00,'Marketing',8,'Beginner','PUBLISHED',334);
SELECT setval('courses_id_seq', (SELECT MAX(id) FROM courses));
