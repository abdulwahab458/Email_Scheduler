# Email Scheduler

A full-stack email scheduling platform that lets authenticated users upload recipient lists, queue bulk emails for future delivery, and track scheduled/sent/failed status from a dashboard.

This repository contains:
- **`backend/`**: Express + TypeScript API, PostgreSQL models, BullMQ queue/worker, Redis-backed throttling.
- **`frontend/`**: React + Vite dashboard with Google sign-in and email scheduling UI.
- **`next-app/`**: separate starter React/Vite app scaffold (not part of the main scheduler flow).

## Overview

Core workflow:
1. User signs in with Google.
2. Frontend sends Google ID token to backend.
3. Backend issues JWT and protects email endpoints.
4. User uploads CSV recipients and submits schedule details.
5. Backend persists scheduled records in PostgreSQL.
6. Jobs are queued in BullMQ (Redis) for delayed processing.
7. Worker sends email via Nodemailer + Ethereal SMTP senders.
8. Delivery results are stored and shown in dashboard tables.

## Architecture

```text
Frontend (React/Vite)
        |
        v
Express API (/api/auth, /api/emails)
        |
        +--> PostgreSQL (users, scheduled_emails, senders, email_log)
        |
        +--> Redis + BullMQ queue (delayed jobs)
                         |
                         v
                    Worker process
                         |
                         v
                 Nodemailer/Ethereal SMTP
```

## Key Features

### Backend
- Google OAuth token verification + JWT auth.
- CSV recipient parsing endpoint.
- Batch scheduling with idempotency keys.
- Delayed queue execution with BullMQ.
- Redis-backed per-sender hourly rate limit.
- Configurable inter-email delay and worker concurrency.
- Recovery of pending scheduled jobs on restart.
- Sent/failed logging with sender attribution.

### Frontend
- Google login flow.
- Protected dashboard route.
- Compose modal for subject/body/schedule configuration.
- CSV upload + parsed recipient preview.
- Scheduled and sent/failed paginated tables.
- Toast notifications and loading/error states.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, Sequelize, PostgreSQL, Redis, BullMQ, Nodemailer, Google Auth Library, JWT.
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router, Axios, React Toastify.
- **Dev Infra**: Docker Compose (Redis + PostgreSQL).

## Prerequisites

- **Node.js** 20+ (recommended)
- **npm**
- **Docker + Docker Compose** (recommended for local Redis/PostgreSQL)
  - or local Redis/PostgreSQL instances managed manually

## Environment Variables

Create a root-level `.env` file (used by backend runtime and sequelize CLI):

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `4000` | Backend API port |
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `REDIS_URL` | No | `redis://localhost:6379` | Redis connection string |
| `GOOGLE_CLIENT_ID` | Yes | - | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | - | Google OAuth client secret |
| `JWT_SECRET` | Yes | - | JWT signing secret |
| `JWT_EXPIRES_IN` | Yes | - | JWT expiry (for example `7d`) |
| `MAX_EMAILS_PER_HOUR` | No | `200` | Sender hourly throttle |
| `MIN_DELAY_BETWEEN_EMAILS_MS` | No | `2000` | Minimum delay between sends |
| `WORKER_CONCURRENCY` | No | `5` | BullMQ worker concurrency |

Create `frontend/.env`:

| Variable | Required | Description |
|---|---|---|
| `VITE_BACKEND_URL` | Yes | API base URL (for example `http://localhost:4000`) |
| `VITE_GOOGLE_CLIENT_ID` | Yes | Same OAuth client ID used by backend |

> Do not commit `.env` files or real secrets.

## Setup

### 1) Clone and install dependencies

```bash
git clone <repository-url>
cd Email_Scheduler

cd backend && npm install
cd ../frontend && npm install
```

(Optional scaffold app)
```bash
cd ../next-app && npm install
```

### 2) Start infrastructure

From repository root:

```bash
docker compose up -d
```

Services exposed:
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

### 3) Configure environment files

- Add root `.env` (backend values).
- Add `frontend/.env` (Vite values).

## Local Development

### Run backend

```bash
cd backend
npm run dev
```

Backend startup behavior includes DB connection, sender bootstrap (Ethereal accounts), recovery of queued/scheduled jobs, and worker startup.

### Run frontend

```bash
cd frontend
npm run dev
```

Frontend default dev server runs on Vite's default port (usually `5173`).

## Scripts

### Backend (`backend/package.json`)
- `npm run dev` — start API in watch mode (`tsx`).
- `npm run build` — compile TypeScript to `dist/`.
- `npm run start` — run compiled server.
- `npm run migrate` / `npm run migrate:undo` — Sequelize migrations.

### Frontend (`frontend/package.json`)
- `npm run dev` — start Vite dev server.
- `npm run build` — type-check + production build.
- `npm run lint` — run oxlint.
- `npm run preview` — preview production build.

### Next App (`next-app/package.json`)
- Independent starter app scripts (`dev`, `build`, `lint`, `typecheck`, `format`, `preview`).

## API Surface (high level)

- `POST /api/auth/google` — authenticate with Google ID token.
- `POST /api/emails/parse-csv` — parse CSV recipients (auth required, file upload).
- `POST /api/emails/schedule` — schedule batch emails (auth required).
- `GET /api/emails/scheduled` — list scheduled/queued emails (auth required).
- `GET /api/emails/sent` — list sent/failed emails (auth required).
- `GET /health` — health endpoint.

## Testing

There are currently **no automated test scripts** configured in package manifests. For now, validate changes with:
- frontend lint/build
- backend TypeScript build
- manual smoke checks of login, CSV parse, scheduling, and worker delivery

## Build & Deployment Notes

### Production build

```bash
cd backend && npm run build
cd ../frontend && npm run build
```

### Runtime requirements
- PostgreSQL and Redis must be reachable from backend.
- Set production-grade `JWT_SECRET` and OAuth credentials.
- Run backend using compiled output (`npm run start` in `backend/`).
- Serve frontend static build output from your preferred host/CDN.

## Project Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── jobs/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── queues/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── migrations/
├── frontend/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── store/
│       └── types/
├── next-app/
├── docker-compose.yml
└── README.md
```

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes and verify builds/linting.
4. Open a pull request with a clear summary.

## License

No license file is currently present in this repository. Add a `LICENSE` file to define usage terms.
