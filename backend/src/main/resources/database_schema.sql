-- ============================================================
-- Zero2Earn — MySQL Schema
-- Run once on a clean MySQL 8+ database:
--   CREATE DATABASE zero2earn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--   USE zero2earn;
--   SOURCE database_schema.sql;
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS notifications, enrollments, reviews, messages,
                     conversations, applications, job_skills, jobs,
                     user_skills, courses, skills, users, colleges;
SET FOREIGN_KEY_CHECKS = 1;

-- ─── Colleges ────────────────────────────────────────────────
CREATE TABLE colleges (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    city        VARCHAR(100),
    state       VARCHAR(100),
    logo_url    VARCHAR(500),
    verified    BOOLEAN DEFAULT FALSE,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─── Users ───────────────────────────────────────────────────
CREATE TABLE users (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    username        VARCHAR(50)  NOT NULL UNIQUE,
    email           VARCHAR(200) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            ENUM('STUDENT','TEACHER','ADMIN') DEFAULT 'STUDENT',
    college_id      INT,
    bio             TEXT,
    avatar_url      VARCHAR(500),
    phone           VARCHAR(20),
    xp              INT DEFAULT 0,
    rating          DECIMAL(3,2) DEFAULT 0.00,
    rating_count    INT DEFAULT 0,
    wallet_balance  DECIMAL(12,2) DEFAULT 0.00,
    active          BOOLEAN DEFAULT TRUE,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_college FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ─── Skills ──────────────────────────────────────────────────
CREATE TABLE skills (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    category    VARCHAR(100) DEFAULT 'General'
) ENGINE=InnoDB;

-- ─── User ↔ Skills ───────────────────────────────────────────
CREATE TABLE user_skills (
    user_id     INT NOT NULL,
    skill_id    INT NOT NULL,
    proficiency ENUM('Beginner','Intermediate','Expert') DEFAULT 'Beginner',
    PRIMARY KEY (user_id, skill_id),
    FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── Jobs ────────────────────────────────────────────────────
CREATE TABLE jobs (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(300) NOT NULL,
    description     TEXT NOT NULL,
    poster_id       INT NOT NULL,
    college_id      INT,
    type            ENUM('PAID','UNPAID','INTERNSHIP') DEFAULT 'PAID',
    budget          DECIMAL(12,2),
    currency        VARCHAR(10) DEFAULT 'INR',
    deadline        DATE,
    status          ENUM('OPEN','IN_PROGRESS','COMPLETED','CANCELLED') DEFAULT 'OPEN',
    remote          BOOLEAN DEFAULT TRUE,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_job_poster  FOREIGN KEY (poster_id)  REFERENCES users(id)    ON DELETE CASCADE,
    CONSTRAINT fk_job_college FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ─── Job ↔ Skills ────────────────────────────────────────────
CREATE TABLE job_skills (
    job_id      INT NOT NULL,
    skill_id    INT NOT NULL,
    PRIMARY KEY (job_id, skill_id),
    FOREIGN KEY (job_id)   REFERENCES jobs(id)   ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── Applications ────────────────────────────────────────────
CREATE TABLE applications (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    job_id          INT NOT NULL,
    applicant_id    INT NOT NULL,
    cover_letter    TEXT,
    proposed_budget DECIMAL(12,2),
    estimated_days  INT,
    status          ENUM('PENDING','ACCEPTED','REJECTED','COMPLETED','WITHDRAWN') DEFAULT 'PENDING',
    applied_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_application (job_id, applicant_id),
    CONSTRAINT fk_app_job       FOREIGN KEY (job_id)       REFERENCES jobs(id)  ON DELETE CASCADE,
    CONSTRAINT fk_app_applicant FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── Reviews ─────────────────────────────────────────────────
CREATE TABLE reviews (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    job_id       INT NOT NULL,
    reviewer_id  INT NOT NULL,
    reviewee_id  INT NOT NULL,
    rating       TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment      TEXT,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_review (job_id, reviewer_id),
    CONSTRAINT fk_review_job      FOREIGN KEY (job_id)      REFERENCES jobs(id)  ON DELETE CASCADE,
    CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_reviewee FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── Conversations ───────────────────────────────────────────
CREATE TABLE conversations (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    participant_1   INT NOT NULL,
    participant_2   INT NOT NULL,
    job_id          INT,
    last_message    TEXT,
    last_message_at DATETIME,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_conv (participant_1, participant_2),
    CONSTRAINT fk_conv_p1  FOREIGN KEY (participant_1) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_conv_p2  FOREIGN KEY (participant_2) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_conv_job FOREIGN KEY (job_id)        REFERENCES jobs(id)  ON DELETE SET NULL
) ENGINE=InnoDB;

-- ─── Messages ────────────────────────────────────────────────
CREATE TABLE messages (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_id       INT NOT NULL,
    content         TEXT,
    msg_type        ENUM('TEXT','FILE','IMAGE') DEFAULT 'TEXT',
    file_url        VARCHAR(500),
    sent_at         DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_at         DATETIME,
    CONSTRAINT fk_msg_conv   FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id)       REFERENCES users(id)         ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── Courses ─────────────────────────────────────────────────
CREATE TABLE courses (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(300) NOT NULL,
    description     TEXT,
    instructor_id   INT NOT NULL,
    price           DECIMAL(10,2) DEFAULT 0.00,
    currency        VARCHAR(10) DEFAULT 'INR',
    thumbnail_url   VARCHAR(500),
    category        VARCHAR(100) DEFAULT 'General',
    duration_hours  INT DEFAULT 0,
    difficulty      ENUM('Beginner','Intermediate','Advanced') DEFAULT 'Beginner',
    status          ENUM('DRAFT','PUBLISHED','ARCHIVED') DEFAULT 'PUBLISHED',
    rating          DECIMAL(3,2) DEFAULT 0.00,
    enrolled_count  INT DEFAULT 0,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_instructor FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── Enrollments ─────────────────────────────────────────────
CREATE TABLE enrollments (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL,
    course_id    INT NOT NULL,
    progress_pct INT DEFAULT 0,
    enrolled_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    UNIQUE KEY uk_enrollment (user_id, course_id),
    CONSTRAINT fk_enroll_user   FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
    CONSTRAINT fk_enroll_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── Notifications ───────────────────────────────────────────
CREATE TABLE notifications (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    type       VARCHAR(50),
    title      VARCHAR(200),
    message    TEXT,
    read_flag  BOOLEAN DEFAULT FALSE,
    ref_id     INT,
    ref_type   VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX idx_jobs_status      ON jobs(status);
CREATE INDEX idx_jobs_poster      ON jobs(poster_id);
CREATE INDEX idx_jobs_college     ON jobs(college_id);
CREATE INDEX idx_apps_job         ON applications(job_id);
CREATE INDEX idx_apps_applicant   ON applications(applicant_id);
CREATE INDEX idx_msgs_conv        ON messages(conversation_id);
CREATE INDEX idx_notifs_user      ON notifications(user_id, read_flag);
CREATE INDEX idx_users_email      ON users(email);
CREATE INDEX idx_users_username   ON users(username);

-- ============================================================
-- SEED DATA
-- Passwords are BCrypt of "Test@1234"
-- ============================================================

INSERT INTO colleges (id, name, city, state, verified) VALUES
(1, 'MIT Pune',     'Pune',      'Maharashtra', TRUE),
(2, 'IIT Bombay',   'Mumbai',    'Maharashtra', TRUE),
(3, 'VIT Vellore',  'Vellore',   'Tamil Nadu',  TRUE),
(4, 'BITS Pilani',  'Pilani',    'Rajasthan',   TRUE),
(5, 'NIT Trichy',   'Tiruchirappalli', 'Tamil Nadu', TRUE);

INSERT INTO users (id, name, username, email, password_hash, role, college_id, bio, xp) VALUES
(1, 'Admin User',   'admin',   'admin@zero2earn.in',
 '$2a$12$jN5H3T7O8lQ2K4FzYpW.sO1xVcZ5t2CmN9R7aD0eG6wL8yU3mP4Ki', 'ADMIN',   NULL, 'Platform administrator', 9999),
(2, 'Rahul Sharma', 'rahul_s', 'rahul@mitpune.edu',
 '$2a$12$jN5H3T7O8lQ2K4FzYpW.sO1xVcZ5t2CmN9R7aD0eG6wL8yU3mP4Ki', 'STUDENT', 1,    'Full-stack dev & ML enthusiast. Love building things!', 320),
(3, 'Prof. Neha Joshi', 'prof_neha', 'neha@mitpune.edu',
 '$2a$12$jN5H3T7O8lQ2K4FzYpW.sO1xVcZ5t2CmN9R7aD0eG6wL8yU3mP4Ki', 'TEACHER', 1,    'Professor of Computer Science at MIT Pune.', 150),
(4, 'Priya Verma',  'priyav',  'priya@iitb.ac.in',
 '$2a$12$jN5H3T7O8lQ2K4FzYpW.sO1xVcZ5t2CmN9R7aD0eG6wL8yU3mP4Ki', 'STUDENT', 2,    'Design & branding enthusiast. UI/UX freelancer.', 210),
(5, 'Arjun Mehta',  'arjunm',  'arjun@vit.ac.in',
 '$2a$12$jN5H3T7O8lQ2K4FzYpW.sO1xVcZ5t2CmN9R7aD0eG6wL8yU3mP4Ki', 'STUDENT', 3,    'Android & Flutter developer. Open to internships.', 180);

INSERT INTO skills (id, name, category) VALUES
(1,  'React',            'Programming'),
(2,  'Node.js',          'Programming'),
(3,  'Python',           'Programming'),
(4,  'Java',             'Programming'),
(5,  'Spring Boot',      'Programming'),
(6,  'MySQL',            'Programming'),
(7,  'UI/UX Design',     'Design'),
(8,  'Figma',            'Design'),
(9,  'Graphic Design',   'Design'),
(10, 'Machine Learning', 'AI/ML'),
(11, 'Data Science',     'AI/ML'),
(12, 'Flutter',          'Mobile'),
(13, 'Android',          'Mobile'),
(14, 'Content Writing',  'Writing'),
(15, 'Digital Marketing','Marketing'),
(16, 'Video Editing',    'Media'),
(17, 'Photography',      'Media'),
(18, 'Excel / Sheets',   'General'),
(19, 'Canva',            'Design'),
(20, 'TypeScript',       'Programming');

INSERT INTO user_skills (user_id, skill_id, proficiency) VALUES
(2, 1,  'Expert'),  (2, 3, 'Intermediate'), (2, 10, 'Beginner'),
(3, 5,  'Expert'),  (3, 4, 'Expert'),
(4, 7,  'Expert'),  (4, 8, 'Expert'),       (4, 9,  'Intermediate'),
(5, 12, 'Expert'),  (5, 13,'Expert'),       (5, 4,  'Intermediate');

INSERT INTO jobs (id, title, description, poster_id, college_id, type, budget, deadline, status, remote) VALUES
(1, 'Build a React Portfolio Website',
 'Need a clean, modern portfolio website built with React. Should include a home page, projects section, contact form, and responsive design. Dark theme preferred.',
 3, 1, 'PAID', 3500.00, DATE_ADD(CURDATE(), INTERVAL 14 DAY), 'OPEN', TRUE),

(2, 'Design a Mobile App UI in Figma',
 'Looking for a talented UI designer to create 8-10 screens for a food delivery app. Must include user flow, component library, and prototype links.',
 3, 1, 'PAID', 2500.00, DATE_ADD(CURDATE(), INTERVAL 10 DAY), 'OPEN', TRUE),

(3, 'Python Web Scraper for Research Data',
 'I need a Python script that scrapes academic paper data from two websites, stores results in CSV, and handles pagination and rate limiting gracefully.',
 2, 1, 'PAID', 1500.00, DATE_ADD(CURDATE(), INTERVAL 7 DAY),  'OPEN', TRUE),

(4, 'Content Writing — 5 Blog Articles',
 'Write 5 SEO-friendly blog posts (800-1000 words each) about technology trends for college students. Topics provided. Must pass Copyscape.',
 3, 1, 'PAID', 2000.00, DATE_ADD(CURDATE(), INTERVAL 21 DAY), 'OPEN', TRUE),

(5, 'ML Model for Student Score Prediction',
 'Build a simple ML regression model using scikit-learn to predict student exam scores based on study hours, sleep, and prior scores. Provide accuracy metrics.',
 3, 1, 'UNPAID', NULL, DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'OPEN', TRUE),

(6, 'Flutter App — College Event Manager',
 'Develop a cross-platform Flutter app for managing college events. Features: event list, RSVP, notifications, admin panel. Firebase backend preferred.',
 3, NULL, 'INTERNSHIP', NULL, DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'OPEN', FALSE);

INSERT INTO job_skills (job_id, skill_id) VALUES
(1,1),(1,20),
(2,7),(2,8),
(3,3),
(4,14),
(5,3),(5,10),(5,11),
(6,12),(6,13);

INSERT INTO courses (id, title, description, instructor_id, price, category, duration_hours, difficulty, status, enrolled_count) VALUES
(1, 'React Zero to Hero', 'Learn React from scratch to building full production apps. Covers hooks, Context, React Router, Axios, and deployment.', 3, 999.00,  'Programming', 20, 'Beginner',     'PUBLISHED', 145),
(2, 'UI/UX Design with Figma', 'Master Figma for mobile and web design. Learn components, variants, auto-layout, and professional prototyping techniques.', 4, 799.00,  'Design',       15, 'Beginner',     'PUBLISHED', 98),
(3, 'Python for Data Science', 'Hands-on Python for data analysis using NumPy, Pandas, Matplotlib, and Scikit-learn. Includes 5 real-world projects.', 2, 599.00,  'AI/ML',        25, 'Intermediate', 'PUBLISHED', 212),
(4, 'Spring Boot Masterclass', 'Build production-grade REST APIs with Spring Boot, Security, JDBC, and MySQL. Deploy to cloud with Docker.', 3, 1299.00, 'Programming', 30, 'Intermediate', 'PUBLISHED', 67),
(5, 'Flutter App Development', 'Build beautiful cross-platform mobile apps with Flutter and Dart. From layouts to Firebase integration.', 5, 899.00,  'Mobile',       22, 'Beginner',     'PUBLISHED', 89),
(6, 'Digital Marketing Basics', 'Learn SEO, social media marketing, email campaigns, and Google Ads. Perfect for beginners and student entrepreneurs.', 3, 0.00,    'Marketing',    8,  'Beginner',     'PUBLISHED', 334);

-- Default Admin password reminder: Test@1234
-- Student demo: rahul@mitpune.edu / Test@1234
