# QtechJira — Ticket Management System

A full-stack, role-based ticket management system (Jira-style) with a React (Vite) frontend and an Express + MongoDB REST API.

---

## 🔗 Submission Links

| Item | URL |
|------|-----|
| **GitHub Repository** | https://github.com/Risafamtii/QtechJira |
| **Frontend (Live)** | _TODO: add Vercel URL after deploy_ |
| **Backend (Live)** | _TODO: add Render URL after deploy_ |
| **Backend Health Check** | _TODO: `<backend-url>/api/health`_ |

### 🔑 Test Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@example.com` | `Admin@123` |
| **Agent** | `agent@example.com` | `Agent@123` |
| **User**  | `user@example.com`  | `User@123` |

> These accounts are created by `npm run seed`. You can also register a new account from the UI — new sign-ups are always created with the **User** role.

---

## 🧱 Tech Stack

**Frontend:** React 18, Vite, Redux Toolkit, React Router, Axios, Tailwind CSS
**Backend:** Node.js, Express, Mongoose (MongoDB), JWT auth, bcrypt
**Database:** MongoDB Atlas
**Hosting:** Frontend on Vercel · Backend on Render · DB on MongoDB Atlas

## 📁 Repository Structure

```
QtechJira/
├── frontEnd/        # React + Vite SPA
│   ├── src/
│   └── vercel.json  # SPA routing rewrite
├── backEnd/         # Express REST API
│   ├── src/
│   └── .env.example
├── render.yaml      # Render blueprint for the backend
└── README.md
```

---

## 👥 Roles & Permissions

| Capability | User | Agent | Admin |
|------------|:----:|:-----:|:-----:|
| Register / login | ✅ | ✅ | ✅ |
| Create a ticket | ✅ | — | — |
| View own tickets | ✅ | — | ✅ (all) |
| View assigned tickets | — | ✅ | ✅ (all) |
| Edit own (non-closed) ticket | ✅ | — | ✅ |
| Update ticket status | — | ✅ (assigned) | ✅ |
| Assign tickets | — | — | ✅ |
| Delete tickets | — | — | ✅ |
| Comment on a ticket | ✅ (own) | ✅ (assigned) | — |
| Manage users (CRUD, roles) | — | — | ✅ |
| View dashboard stats | ✅ (own) | ✅ | ✅ (global) |

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+ and npm
- A MongoDB connection string (local or MongoDB Atlas)

### 1. Backend
```bash
cd backEnd
npm install
cp .env.example .env          # then fill in the values (see table below)
npm run seed                  # creates Admin, Agent, User test accounts
npm run dev                   # http://localhost:5000  (nodemon)
# or: npm start               # plain node, no auto-restart
```

### 2. Frontend
```bash
cd frontEnd
npm install
# create .env with the API base URL:
#   VITE_API_BASE_URL=http://localhost:5000/api
npm run dev                   # http://localhost:5173
```

Open http://localhost:5173 and log in with one of the seeded accounts.

---

## ⚙️ Environment Variables

### Backend (`backEnd/.env`)

| Variable | Required | Example / Default | Description |
|----------|:--------:|-------------------|-------------|
| `PORT` | no | `5000` | Port the API listens on (Render sets this automatically). |
| `MONGODB_URI` | **yes** | `mongodb+srv://user:pass@cluster.../ticket_management` | MongoDB connection string. |
| `JWT_SECRET` | **yes** | `a-long-random-string` | Secret used to sign JWTs. |
| `JWT_EXPIRES_IN` | no | `7d` | Token lifetime. |
| `FRONTEND_URL` | no | `http://localhost:5173` | Allowed CORS origin(s). Comma-separate multiple (e.g. `https://app.vercel.app,http://localhost:5173`). |
| `ADMIN_EMAIL` | yes (seed) | `admin@example.com` | Root admin email for `npm run seed`. |
| `ADMIN_PASSWORD` | yes (seed) | `Admin@123` | Root admin password for `npm run seed`. |
| `AGENT_EMAIL` / `AGENT_PASSWORD` | no | `agent@example.com` / `Agent@123` | Optional overrides for the seeded Agent. |
| `USER_EMAIL` / `USER_PASSWORD` | no | `user@example.com` / `User@123` | Optional overrides for the seeded User. |

### Frontend (`frontEnd/.env`)

| Variable | Required | Example | Description |
|----------|:--------:|---------|-------------|
| `VITE_API_BASE_URL` | **yes** | `http://localhost:5000/api` (local) · `https://<backend>.onrender.com/api` (prod) | Base URL of the backend API. Baked in at build time. |

---

## 📚 API Documentation

Base URL: `<backend-url>/api`
All responses use the envelope: `{ "success": boolean, "message": string, "data": ... | "errors": ... }`
Authenticated routes require an `Authorization: Bearer <token>` header.

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | public | Register a new account (role = User). Returns `{ user, token }`. |
| `POST` | `/auth/login` | public | Log in. Returns `{ user, token }`. |
| `GET`  | `/auth/me` | any | Get the current authenticated user. |

### Tickets
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/tickets` | any | List tickets (paginated; supports `search`, `status`, `priority`, `category`, `sortBy`, `order`, `page`, `limit`). Scoped by role. |
| `POST` | `/tickets` | User | Create a ticket (`title`, `description`, `category`, `priority`). |
| `GET`  | `/tickets/:id` | any | Get a single ticket. |
| `PATCH`| `/tickets/:id` | Admin, User (owner) | Update ticket fields. |
| `DELETE`| `/tickets/:id` | Admin | Delete a ticket. |
| `PATCH`| `/tickets/:id/status` | Admin, Agent (assigned) | Update ticket status. |
| `PATCH`| `/tickets/:id/assign` | Admin | Assign a ticket to an agent. |
| `POST` | `/tickets/:id/comments` | User (own), Agent (assigned) | Add a comment. |

### Users (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/users` | List users (paginated, role filter). |
| `POST` | `/users` | Create a user with a role. |
| `GET`  | `/users/:id` | Get a user. |
| `PATCH`| `/users/:id` | Update a user (name / role). |
| `DELETE`| `/users/:id` | Delete a user. |

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/dashboard/stats` | any | Ticket statistics, scoped by role. |

### Misc
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/health` | Health check → `{ success: true, message: "API is running" }`. |

---

## ☁️ Deployment

> Deploy order matters: **backend first**, then frontend, then point the backend's CORS at the frontend.

### 0. MongoDB Atlas
- Create a free cluster and a database user.
- **Network Access → Allow Access from Anywhere (`0.0.0.0/0`)** — required because Render's outbound IPs are dynamic.
- Copy the connection string (append `/ticket_management` as the DB name).

### 1. Backend → Render
1. Render → **New → Web Service** → connect this GitHub repo.
2. **Root Directory:** `backEnd` · **Build:** `npm install` · **Start:** `npm start`.
3. Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN=7d`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `FRONTEND_URL` (set after step 2).
4. Deploy. Verify `https://<service>.onrender.com/api/health`.
5. Seed accounts: in the Render **Shell**, run `npm run seed` (one time).
   _(Alternatively, import `render.yaml` via Render → New → Blueprint.)_

### 2. Frontend → Vercel
1. Vercel → **Add New → Project** → import this repo.
2. **Root Directory:** `frontEnd` (Framework preset: Vite).
3. Environment variable: `VITE_API_BASE_URL = https://<service>.onrender.com/api`.
4. Deploy → note the URL, e.g. `https://qtechjira.vercel.app`. (`vercel.json` handles SPA routing.)

### 3. Connect them
- In Render, set `FRONTEND_URL` to your Vercel URL (e.g. `https://qtechjira.vercel.app`) and redeploy the backend so CORS allows it.

---

## 📝 Important Notes
- **Render free tier sleeps** after ~15 min of inactivity; the first request afterwards takes ~30–50s to wake (cold start). This is normal.
- The frontend talks to the **deployed backend** via `VITE_API_BASE_URL` — no `localhost` in production.
- `.env` files are git-ignored and never committed; configure secrets in the Render/Vercel dashboards.
