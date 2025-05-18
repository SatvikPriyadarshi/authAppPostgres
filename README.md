# 🛡️ AuthApp - Node.js, PostgreSQL, EJS Authentication System

A secure authentication system built with Node.js, Express, PostgreSQL (raw SQL), EJS templating, bcrypt password hashing, JWT session handling, and Google reCAPTCHA integration.

---

## 🌐 Live Demo

[https://authapppostgres.onrender.com](https://authapppostgres.onrender.com)

---

## 📁 Features

- User Registration with reCAPTCHA
- Secure Login with rate limiting
- Session handling using JWT (with expiry)
- Profile page with session expiry warning
- Logout functionality
- PostgreSQL database (hosted on Render)
- Render deployment (free tier)
- MVC folder structure
- Protection against brute-force attacks

---

## 📦 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Templating:** EJS
- **Auth:** JWT, bcrypt
- **Security:** Helmet, express-rate-limit, reCAPTCHA
- **Deployment:** Render
- **ORM:** None (raw SQL)

---

## 🛠️ Local Setup

1. **Clone the repository**
git clone https://github.com/SatvikPriyadarshi/authAppPostgres.git
cd authAppPostgres

2. Install Dependencies
npm install

3. Create a PostgreSQL Database and Table
If you're using pgAdmin, create a new database (e.g., authapp), then run this SQL query to create the required table:
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

5. Run the Application Locally
node app.js
Visit: http://localhost:3000

6. Optional - Health Check Endpoint
To verify that the server is up and running, visit:
http://localhost:3000/health-check
