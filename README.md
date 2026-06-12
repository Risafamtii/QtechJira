# QtechJira

A ticket management system with role-based access (Admin / Agent / User). React + Vite on the front, Express + MongoDB on the back.

## Live

- App: https://qtech-jira.vercel.app
- API: https://qtechjira.onrender.com/api
- Repo: https://github.com/Risafamtii/QtechJira

## Test accounts

| Role  | Email               | Password   |
|-------|---------------------|------------|
| Admin | admin@example.com   | Admin@123  |
| Agent | agent1@example.com   | Agent@123  |
| User  | user1@example.com    | User@123   |

You can also sign up from the login page — new accounts are created as a normal User.

## What each role can do

- **User** – creates tickets, comments on their own, tracks status.
- **Agent** – works tickets assigned to them, updates status, comments.
- **Admin** – manages users and roles, assigns and deletes tickets, sees all stats.

## Tech

Frontend: React 18, Vite, Redux Toolkit, React Router, Axios, Tailwind.
Backend: Node/Express, Mongoose, JWT, bcrypt. Database on MongoDB Atlas.

## Running locally

You'll need Node 18+ and a MongoDB connection string (Atlas or local).

Backend:

```
cd backEnd
npm install
cp .env.example .env      # then fill in the values
npm run seed              # creates the Admin/Agent/User accounts
npm run dev               # http://localhost:5000
```

Frontend:

```
cd frontEnd
npm install
echo VITE_API_BASE_URL=http://localhost:5000/api > .env
npm run dev               # http://localhost:5173
```

## Environment variables

Backend (`backEnd/.env`):

| Key            | Notes                                                    |
|----------------|----------------------------------------------------------|
| MONGODB_URI    | Mongo connection string (required)                       |
| JWT_SECRET     | secret for signing tokens (required)                     |
| JWT_EXPIRES_IN | token lifetime, e.g. `7d`                                |
| FRONTEND_URL   | allowed origin for CORS; comma-separate for multiple     |
| ADMIN_EMAIL / ADMIN_PASSWORD | used by `npm run seed`                     |

Frontend (`frontEnd/.env`):

| Key               | Notes                                  |
|-------------------|----------------------------------------|
| VITE_API_BASE_URL | base URL of the API, e.g. `<api>/api`  |

## API overview

Base URL: `<api>/api`. Responses follow `{ success, message, data | errors }`. Protected routes need an `Authorization: Bearer <token>` header.

Auth:
- `POST /auth/register` – register (returns user + token)
- `POST /auth/login` – login (returns user + token)
- `GET /auth/me` – current user

Tickets:
- `GET /tickets` – list (paginated; search / status / priority / category / sort)
- `POST /tickets` – create (User)
- `GET /tickets/:id` – details
- `PATCH /tickets/:id` – update (owner or Admin)
- `DELETE /tickets/:id` – delete (Admin)
- `PATCH /tickets/:id/status` – update status (Admin / assigned Agent)
- `PATCH /tickets/:id/assign` – assign to an agent (Admin)
- `POST /tickets/:id/comments` – add a comment

Users (Admin only):
- `GET /users`, `POST /users`, `GET /users/:id`, `PATCH /users/:id`, `DELETE /users/:id`

Dashboard:
- `GET /dashboard/stats` – ticket stats, scoped to the user's role

## Deployment

Frontend is on Vercel (root dir `frontEnd`, env `VITE_API_BASE_URL` pointing at the API). Backend is on Render (root dir `backEnd`, `npm start`), with the env vars above set in the dashboard. The database is MongoDB Atlas with network access open to the Render service.

Note: the Render free tier sleeps after some idle time, so the first request after a while can take a little longer to respond.
