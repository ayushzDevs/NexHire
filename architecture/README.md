# NexHire — AI Career Accelerator

> Close the gap between your current skills and your dream role.

NexHire is a full-stack Gen AI application that analyzes your resume against target job roles, generates ATS-optimized resumes, and prepares you with role-specific interview questions.

---

## What it does

| Feature | Description |
|---|---|
| Skill Gap Analysis | Compares resume against target job role and highlights missing skills |
| ATS Resume Builder | Generates a tailored, ATS-friendly resume based on the gap analysis |
| Interview Prep | Generates technical and behavioral questions relevant to the target role |

---

## Tech Stack

### Frontend
- React (Vite)
- SCSS (BEM methodology)
- React Router DOM
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Passport.js (Local + JWT strategies)
- bcrypt (password hashing + salting)
- JSON Web Tokens (jsonwebtoken)
- Google Generative AI / OpenAI SDK

---

## Project Structure

```
nexhire/
├── client/                        # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosInstance.js   # axios base config + interceptors
│   │   │   └── authApi.js         # auth API methods (login, register, logout)
│   │   ├── components/
│   │   │   ├── BrandPanel.jsx     # left dark panel (logo + features)
│   │   │   ├── FormField.jsx      # reusable labeled input with error state
│   │   │   ├── SubmitButton.jsx   # CTA button with loading spinner
│   │   │   ├── OAuthButton.jsx    # Google / GitHub OAuth buttons
│   │   │   ├── SuccessState.jsx   # post-login/register success screen
│   │   │   └── PasswordStrength.jsx # live password strength indicator
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── styles/
│   │   │   └── _variables.scss    # design tokens (colors, fonts, radii)
│   │   └── App.jsx                # router setup
│   ├── .env
│   └── package.json
│
└── server/                        # Express backend
    ├── controllers/
    │   └── auth.controller.js     # register, login, logout, getMe
    ├── middleware/
    │   └── auth.middleware.js     # JWT verification middleware
    ├── models/
    │   ├── user.model.js          # User schema
    │   └── blacklist.model.js     # Token blacklist schema
    ├── routes/
    │   └── auth.routes.js         # /auth/* route definitions
    ├── config/
    │   └── passport.config.js     # Passport Local + JWT strategies
    ├── .env
    ├── app.js                     # Express app setup
    └── package.json
```

---

## Auth Flow

```
Register:
  POST /auth/signup
  → validate input
  → check if user exists
  → bcrypt.hash(password, 12)
  → save user to MongoDB
  → jwt.sign({ id, username })
  → set cookie + return token

Login:
  POST /auth/login
  → Passport Local Strategy
  → authService.findByEmail()
  → bcrypt.compare(plain, hash)
  → jwt.sign({ id, username })
  → set cookie + return token

Protected Route:
  GET /auth/me (or any /api/* route)
  → auth middleware runs
  → extract token from cookie or Authorization header
  → check token against blacklist
  → jwt.verify(token, JWT_SECRET)
  → attach req.user → next()

Logout:
  POST /auth/logout
  → add token to blacklist collection
  → res.clearCookie("token")
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/nexhire.git
cd nexhire
```

### 2. Setup backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/nexhire
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

### 3. Setup frontend

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

### 4. Open in browser

```
http://localhost:5173
```

---

## API Reference

### Auth Routes — `/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/signup` | Public | Register new user |
| POST | `/auth/login` | Public | Login user |
| POST | `/auth/logout` | Private | Logout + blacklist token |
| GET | `/auth/me` | Private | Get current user |

### Request bodies

**POST `/auth/signup`**
```json
{
  "username": "johndoe",
  "email": "john@email.com",
  "password": "securepassword"
}
```

**POST `/auth/login`**
```json
{
  "email": "john@email.com",
  "password": "securepassword"
}
```

### Response format

```json
{
  "message": "User logged in successfully",
  "user": {
    "id": "64f...",
    "username": "johndoe",
    "email": "john@email.com"
  },
  "token": "eyJhbGci..."
}
```

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Express server port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `CLIENT_URL` | Frontend URL for CORS |

### Frontend (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL |

---

## Security

- Passwords hashed with **bcrypt** (cost factor 12) — salting is automatic
- JWT tokens expire in **5 days**
- Logged-out tokens are **blacklisted** in MongoDB
- Auth middleware checks blacklist on every protected request
- Tokens sent via **httpOnly cookies** (not accessible via JS)
- CORS restricted to frontend origin only

---

## License

MIT — see [LICENSE](./LICENSE)
