[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/xIbq4TFL)


# Finance Tracker API - README

## 📌 Overview
Finance Tracker is a RESTful API for managing personal finances. The system should facilitate users in managing their financial records, tracking expenses, setting budgets, and analyzing spending trends. Emphasizing secure access, data integrity, and user friendly interfaces, this project aims to simulate real-world software development challenges and solutions within a financial management context. The Finance Tracker API is designed to manage user transactions, budgets, goals, reports, and notifications in a financial tracking system. This API includes authentication, authorization, and role-based access control.

## Features
- **User Authentication & Roles**: Admin & Regular users (JWT-based authentication)
- **Expense & Income Management**: CRUD operations with categorization
- **Recurring Transactions**: Automate recurring payments
- **Budget Tracking**: Set, manage, and monitor budgets
- **Financial Reports**: Generate reports with filters (date, category, tags)
- **Notifications & Alerts**: Unusual spending & budget alerts
- **Multi-Currency Support**: Convert transactions to different currencies
- **Role-Based Dashboard**: Admin & User dashboards

---

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Security**: JWT authentication, bcrypt password hashing
- **Testing**: Jest, Supertest, OWASP ZAP, Artillery

---

## 🚀 Setup Instructions
### 1️⃣ Prerequisites
Ensure you have the following installed:
- **Node.js** (v16 or later)
- **MongoDB** 
- **npm** (Node Package Manager)


### 2️⃣ Clone the Repository
```bash
git clone https://github.com/SE1020-IT2070-OOP-DSA-25/project-shaniranasinghe.git
cd project-shaniranasinghe
```

### 3️⃣ Install Dependencies
```bash
npm install
```

### 4️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and configure the following:
```
PORT = 8000
MONGO_URL = "mongodb://localhost:27017/FinanceTracker"
EMAIL=shaniranasinghe20@gmail.com
EMAIL_PASSWORD=icrk baio bbni pddv
JWT_SECRET=jwt_secret_shani
```

### 5️⃣ Start the Server
```bash
npm start
```
The server will start at `http://localhost:8000`

---

## 📡 API Endpoints
### 🔹Authentication Endpoints
| Method | Endpoint            | Description |
|--------|--------------------|-------------|
| POST   | `/api/auth/register` | Register a new user |
| GET    | `/api/auth/verify-email?token=TOKEN` | Verify user email |
| POST   | `/api/auth/login` | Authenticate and get JWT token |

### 🔹User Management
| Method | Endpoint           | Description |
|--------|-------------------|-------------|
| POST   | `/api/users/create` | Create a user (Admin only) |
| GET    | `/api/users/getAllUsers` | Fetch all users (Admin only) |
| PUT    | `/api/users/update/:id` | Update a user (Admin only) |
| DELETE | `/api/users/delete/:id` | Delete a user (Admin only) |
| GET    | `/api/users/profile` | Get logged-in user profile |

### 🔹Transaction Management
| Method | Endpoint                     | Description |
|--------|-----------------------------|-------------|
| POST   | `/api/transactions` | Create a new transaction |
| GET    | `/api/transactions` | Get user transactions |
| PUT    | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |
| GET    | `/api/transactions/user/:userId` | Get transactions by user (Admin only) |
| GET    | `/api/transactions/admin/all` | Get all transactions (Admin only) |
| GET    | `/api/transactions/recurring` | Get recurring transactions |
| POST   | `/api/transactions/recurring` | Create a recurring transaction |
| GET    | `/api/transactions/notifications` | Get transaction notifications |
| GET    | `/api/transactions/exchange-rates` | Fetch exchange rates |

### 🔹Budget Management
| Method | Endpoint          | Description |
|--------|------------------|-------------|
| POST   | `/api/budgets` | Create a new budget |
| GET    | `/api/budgets` | Get user budgets |
| PUT    | `/api/budgets/:id` | Update a budget |
| DELETE | `/api/budgets/:id` | Delete a budget |
| PUT    | `/api/budgets/spend` | Spend from a budget |
| GET    | `/api/budgets/recommendations` | Get budget recommendations |

### 🔹Goal Management
| Method | Endpoint         | Description |
|--------|-----------------|-------------|
| POST   | `/api/goals/create` | Create a goal |
| GET    | `/api/goals` | Get user goals |
| PUT    | `/api/goals/:id` | Update a goal |
| DELETE | `/api/goals/:id` | Delete a goal |
| GET    | `/api/goals/progress` | Get goal progress |
| GET    | `/api/goals/exchange-rates` | Fetch exchange rates |

### 🔹Reports
| Method | Endpoint          | Description |
|--------|------------------|-------------|
| GET    | `/api/reports/trends` | Get spending trends |
| GET    | `/api/reports/summary` | Get income vs expense summary |
| GET    | `/api/reports/filtered` | Get filtered reports |
| GET    | `/api/reports/admin/all` | Get all reports (Admin only) |

### 🔹Notifications
| Method | Endpoint                     | Description |
|--------|-----------------------------|-------------|
| GET    | `/api/notifications/missed-recurring` | Get missed recurring transaction notifications |

### 🔹Dashboard
| Method | Endpoint          | Description |
|--------|------------------|-------------|
| GET    | `/api/dashboard/user` | Get user dashboard |
| GET    | `/api/dashboard/admin` | Get admin dashboard |

### 🔹System Settings
| Method | Endpoint          | Description |
|--------|------------------|-------------|
| POST   | `/api/system-settings` | Configure system settings (Admin only) |
| GET    | `/api/system-settings` | Get system settings |

---


## 🛠 Running Tests

### 1️⃣ Install Test Dependencies
```bash
npm install --save-dev jest supertest mongodb-memory-server
```

### 2️⃣ Run Unit Tests
```bash
npm test
```

### 3️⃣ Run Integration Tests
```bash
npm run test:integration
```

### 4️⃣ Running Performance Tests
```bash
npm run test:performance
```

---

## 🏗️ Testing Environment Setup
### **1️⃣ MongoDB In-Memory Server** (for tests)
We use `mongodb-memory-server` to run tests without needing a real database.

The setupTestDB.js file configures the test database

Ensure test setup includes:
```javascript
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
  jest.setTimeout(20000);
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});
```

### **2️⃣ Mocking Authentication in Tests**
In your test files, use a JWT token:
```javascript
const token = jwt.sign({ userId: 'testUserId', role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
```

### **3️⃣ Debugging Failed Tests**
If tests fail, run with logs:
```bash
npm test -- --detectOpenHandles
```
**Security testing using OWASP ZAP or Burp Suite.**

**performance testing using Artillery or JMeter.**

---

## 📞 Support
For any issues, create an issue on GitHub or contact `shaniranasinghe20@gmail.com`

---

## Contributors

**Shani Ishara Ranasinghe** (Project Owner)


🚀 **Happy Tracking!** 🚀

