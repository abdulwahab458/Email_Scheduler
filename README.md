# Email Scheduler

Production-style email scheduler with Express + BullMQ + Redis + PostgreSQL and a React dashboard.

## Structure

- `backend/` — API, BullMQ worker, Sequelize models
- `frontend/` — React + TypeScript + Tailwind dashboard
- `docker-compose.yml` — Redis and PostgreSQL

## Quick start

1. Start infrastructure:

   ```bash
   docker compose up -d
   ```

2. Backend:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. Frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Copy `.env` values and set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `JWT_SECRET`, and `frontend/.env` `VITE_GOOGLE_CLIENT_ID`.

API: `http://localhost:4000` · UI: `http://localhost:5173`

See `c:\Opencode\email-scheduler-guide.md` for full schema, endpoints, and implementation checklist.
