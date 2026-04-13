# CodeWithAjay — AI Learning Platform

A full-stack learning platform where students pay ₹49 for lifetime access to coding courses, track their progress, and watch embedded YouTube videos.

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

### Student
- 🔐 Sign up / Login with JWT auth
- 📚 Browse and purchase courses (₹49)
- 🎬 Watch videos (YouTube embed)
- 📊 Track progress (% complete, time spent)
- 📈 Daily activity chart

### Admin
- 📊 Dashboard with revenue, users, activity stats
- 📚 Create/Edit/Delete courses
- 🎬 Add/Remove videos
- 👥 View all users with purchase status
- 💳 View all payment transactions

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

## 📐 API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | — | Register |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/profile | JWT | Get profile |
| GET | /api/courses | — | List courses |
| GET | /api/courses/:id | Optional | Course detail |
| GET | /api/payment/key | — | Razorpay key |
| POST | /api/payment/create-order | JWT | Create order |
| POST | /api/payment/verify | JWT | Verify payment |
| POST | /api/progress/update | JWT | Update progress |
| GET | /api/progress/:courseId | JWT | Get progress |
| GET | /api/progress/daily/stats | JWT | Daily stats |
| GET | /api/admin/dashboard | Admin | Stats |
| GET | /api/admin/users | Admin | All users |
| POST | /api/admin/course | Admin | Create course |
| PUT | /api/admin/course/:id | Admin | Update course |
| DELETE | /api/admin/course/:id | Admin | Delete course |
| POST | /api/admin/course/:id/video | Admin | Add video |
| DELETE | /api/admin/video/:id | Admin | Delete video |
| GET | /api/admin/payments | Admin | All payments |

## License

MIT
