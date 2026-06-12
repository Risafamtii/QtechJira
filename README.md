# QtechJira

A full-stack Ticket Management System (Jira-style) with a React (Vite) frontend and an Express + MongoDB backend.

## Structure
- `frontEnd/` — React 18 + Vite + Redux Toolkit + Tailwind CSS
- `backEnd/`  — Node.js + Express + Mongoose + JWT auth

## Getting started

### Backend
```
cd backEnd
npm install
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, etc.
npm run seed           # create the root admin
npm run dev            # http://localhost:5000
```

### Frontend
```
cd frontEnd
npm install
npm run dev            # http://localhost:5173
```

## Roles
- **User** — raises and tracks their own tickets
- **Agent** — works tickets assigned to them (status updates, comments)
- **Admin** — manages users, assigns/deletes tickets, oversees the dashboard
