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

```bash
git clone https://github.com/SatvikPriyadarshi/authAppPostgres.git
cd authAppPostgres
