# CodeWithAjay — AI Learning Platform

A full-stack learning platform where students pay ₹249 for lifetime access to coding courses, track their progress, and watch embedded YouTube videos.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite) + Tailwind CSS v4 |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (JSON Web Tokens) |
| Payments | Razorpay |
| Video | YouTube Embeds (Unlisted) |
| Deployment | Vercel (Frontend + Backend) |

## 📁 Project Structure

```
CodeWithAjay/
├── backend/          # Express API server
│   ├── config/       # Database config
│   ├── controllers/  # Route handlers
│   ├── middleware/    # Auth & Admin middleware
│   ├── models/       # Mongoose schemas
│   ├── routes/       # Express routes
│   ├── seeds/        # DB seed scripts
│   ├── server.js     # Entry point
│   └── vercel.json   # Vercel deployment config
│
├── frontend/         # React + Vite app
│   ├── src/
│   │   ├── api/       # Axios config
│   │   ├── components/ # Reusable UI components
│   │   ├── context/   # Auth context
│   │   ├── hooks/     # Custom hooks
│   │   ├── pages/     # Page components
│   │   │   ├── admin/ # Admin panel pages
│   │   │   └── ...    # User pages
│   │   ├── App.jsx    # Root component
│   │   └── main.jsx   # Entry point
│   └── vercel.json    # Vercel SPA config
│
└── README.md
```

## 🛠️ Local Setup

### Prerequisites
- Node.js v18+ 
- MongoDB (local or Atlas)
- Razorpay account (for payments)

### 1. Clone & Install

```bash
git clone <repo-url>
cd CodeWithAjay

# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/codeWithAjay
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.


## 💳 Razorpay Test Card

| Field | Value |
|-------|-------|
| Card Number | 4111 1111 1111 1111 |
| Expiry | Any future date |
| CVV | Any 3 digits |
| OTP | Skip (test mode) |

## 📱 Features

### 🎓 Student Features
- **🔐 Secure Auth**: Sign up and login with JWT-based authentication.
- **📚 Course Discovery**: Browse available coding courses with lifetime access.
- **💳 Seamless Payments**: Integration with Razorpay for secure course purchases.
- **🎬 Interactive Learning**: Watch high-quality video content via embedded players.
- **🤖 AI Doubt Solver (Ajay AI)**: Context-aware AI chatbot using Gemini to answer questions instantly.
- **💻 Coding Practice Sandbox**: In-browser VS Code-style editor (Monaco) to write and execute code securely.
- **🎮 Gamification (XP & Levels)**: Earn XP and level up by watching videos, coding, commenting, and logging in.
- **🔥 Streak System**: Build daily learning streaks to stay motivated.
- **📜 Automated Certificates**: Generate valid, verifiable PDF certificates upon 100% course completion.
- **💬 Community Discussions**: Ask questions and reply to other students on specific video lessons.
- **🔔 Smart Notifications**: Real-time bell alerts for replies, level ups, streaks, and purchases.
- **⏯️ Continue Learning**: Dashboard widget tracking your last watched position to resume effortlessly.
- **📊 Progress Tracking**: Automatically track completion percentage and time spent on each lesson.
- **📈 Learning Activity**: Visualize daily learning habits with interactive activity charts.
- **🎟️ Referral System**: Apply partner coupons to get discounts on course purchases.
- **🤝 Partner Program**: High-performing users can become partners to generate referral income.

### 🛠️ Admin Features
- **📈 Advanced Analytics**: Interactive Chart.js visualisations for revenue, user growth, and performance trends.
- **🧩 Problem Management**: Create coding challenges with hidden test cases and set XP rewards.
- **📊 Business Dashboard**: Real-time stats on revenue, user growth, and platform activity.
- **📚 Course Management**: Complete CRUD operations for courses and syllabus topics.
- **🎬 Content Control**: Easily add or remove video lessons for any course.
- **👥 User Management**: Monitor all registered users and their purchase history.
- **👑 Role Management**: Promote regular users to "Partner" or "Admin" status.
- **💳 Transaction Logs**: Full visibility into all payment transactions and statuses.
- **🎫 Coupon Engine**: Create, toggle, and delete discount coupons for marketing.

---

## 📐 API Routes

### 🔓 Public & Auth Routes
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/health | — | System health check |
| POST | /api/auth/register | — | Register new user |
| POST | /api/auth/login | — | User login & JWT issuance |
| GET | /api/auth/profile | JWT | Get current user profile |
| GET | /api/courses | — | Fetch all available courses |
| GET | /api/courses/:id | Optional | Get course details (unlocks content if purchased) |

### 💳 Payment & Progress
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/payment/key | — | Get Razorpay public key |
| POST | /api/payment/create-order | JWT | Initialize a new course purchase order |
| POST | /api/payment/verify | JWT | Verify Razorpay payment signature |
| POST | /api/progress/update | JWT | Save lesson progress & time spent |
| GET | /api/progress/:courseId | JWT | Fetch student progress for a specific course |
| GET | /api/progress/daily/stats | JWT | Get activity data for the heat map chart |

### 🎟️ Coupon & Referral
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/coupons/apply | JWT | Validate and apply a coupon to an order |
| GET | /api/coupons/my-stats | JWT | Get personal referral stats (for Partners) |

### 🛡️ Admin Routes
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/admin/dashboard | Admin | Overview stats (Revenue, Users, etc.) |
| GET | /api/admin/users | Admin | List all registered users |
| PUT | /api/admin/make-partner/:userId | Admin | Promote a user to Partner role |
| POST | /api/admin/course | Admin | Create a new course |
| PUT | /api/admin/course/:id | Admin | Update course metadata |
| DELETE | /api/admin/course/:id | Admin | Remove a course from platform |
| POST | /api/admin/course/:id/video | Admin | Add a lesson video to a course |
| DELETE | /api/admin/video/:id | Admin | Delete a specific lesson video |
| GET | /api/admin/payments | Admin | View all payment logs |
| GET | /api/admin/coupons | Admin | List all platform coupons |
| POST | /api/coupons/create | Admin | Create a new discount coupon |
| PATCH | /api/admin/coupons/:id/toggle | Admin | Enable/Disable a coupon |
| DELETE | /api/admin/coupons/:id | Admin | Permanently delete a coupon |

---

## 🚀 Deploy to Vercel

### Backend
```bash
cd backend
vercel --prod
```

### Frontend
```bash
cd frontend
vercel --prod
```

Update the `VITE_API_URL` in frontend to point to your deployed backend URL.

---

## 📄 License

MIT
