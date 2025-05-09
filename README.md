# 🌾 Digi-Farm Lambda API

A serverless RESTful API for managing a **Digital Farm ecosystem**. Built on **AWS Lambda**, this API enables farmers to **check weather**, **track expenses**, **register profiles**, and more — all designed for modern agricultural operations.

---

## 🚀 Features

- ✅ Farmer registration and authentication (JWT-based)
- 🌦️ Weather information endpoint (coming soon)
- 💰 Farm expense and income tracking
- 📍 Digital location & GPS integration
- 🐑 Farmer profile management
- 📊 Scalable & cost-effective via AWS Lambda + API Gateway

---

## 🛠️ Tech Stack

| Technology       | Purpose                       |
|------------------|-------------------------------|
| **TypeScript**   | Type-safe development         |
| **Node.js**      | Runtime environment           |
| **Serverless Framework** | Infrastructure-as-Code |
| **AWS Lambda**   | Compute backend (serverless)  |
| **PostgreSQL**   | Relational database backend   |
| **Sequelize**    | ORM for DB operations         |
| **bcryptjs**     | Password hashing              |
| **JWT**          | Authentication and security   |
| **AWS SSM**      | Secure config parameter store |

---

## 📁 Project Structure

.src
├── handlers/ # Lambda function handlers
├── models/ # Sequelize models
├── helpers/ # Utility functions & middlewares
├── migrations/ # DB migration scripts
├── .env # Environment variables (local only)
├── package.json # Project dependencies
└── README.md


Authentication
Users are authenticated using JWT tokens

Tokens expire after 3 hours

Protected routes require an Authorization header with a Bearer token

