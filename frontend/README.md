# Bellcorp Personal Expense Tracker (MERN Stack)

A full-stack Personal Expense Tracker application built using the MERN stack (MongoDB, Express, React, Node.js).  
This project allows users to securely manage their daily expenses with advanced filtering, pagination, and dashboard analytics.


# Tech Stack

## Frontend
- React (Create React App)
- React Router
- Context API
- Fetch API
- Plain CSS (Responsive)

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt (Password hashing)

---

# Features

## Authentication
- User Registration
- User Login
- JWT-based authentication
- Protected Routes
- Logout functionality

---

## Transaction Management
Users can:
- Add new transactions
- Edit existing transactions
- Delete transactions
- View transaction details (Modal)

Each transaction contains:
- Title
- Amount
- Category
- Date
- Notes (optional)
- User reference

---

## Transaction Explorer
- Dynamic pagination (Load More)
- Search by text
- Filter by category
- Filter by amount range
- Filter by date range
- Empty state handling
- Responsive layout

---

## Dashboard
- Total expense summary
- Category-based breakdown
- Recent transactions preview

---

# Project Structure

```

root/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── dashboardRoutes.js
│   └── index.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar/
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── Dashboard/
│   │   │   └── Explorer/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│
└── README.md

```

---

# Authentication Flow

1. User registers with email & password.
2. Password is hashed using bcrypt.
3. On login, JWT token is generated.
4. Token is stored in localStorage.
5. Protected routes verify token using middleware.

Header format:
```

Authorization: Bearer <token>

```

---

# Filtering Logic

The backend supports dynamic filtering:

- `search`
- `category`
- `min` & `max` amount
- `startDate` & `endDate`
- Pagination (`page`, `limit`)

Query example:

```

/api/transactions?page=1&limit=5&search=food&min=100&max=2000

```

---

# Environment Variables

## Backend

Create:

### `.env.development`
```

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development

```

### `.env.production`
```

PORT=10000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=production

```

---

# Running Locally

## Backend

```

cd backend
npm install
npm run dev

```

## Frontend

```

cd frontend
npm install
npm start

```

---

# Deployment

## Backend
- Hosted on Render (Web Service)
- Environment variables configured in Render dashboard

## Frontend
- Hosted on Render (Static Site)
- Production API URL updated in:
```

frontend/src/services/api.js

```

---

# Key Highlights

- Clean separation of frontend & backend
- Secure JWT-based authentication
- Scalable filtering system
- Pagination support
- Responsive UI
- Professional folder structure

---

# 👨‍💻 Author

Prasannakumar Bogachandrapu  
Full Stack Developer  

---

# 📧 Submission

Submitted to:
engineering@bellcorpstudio.com
```