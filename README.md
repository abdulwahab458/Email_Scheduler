# Email Scheduler

A full-stack email scheduling system that allows users to authenticate with Google, upload recipient lists, schedule emails for future delivery, and monitor scheduled and sent emails. The backend is built with Express, TypeScript, BullMQ, Redis, PostgreSQL, and Sequelize, while the frontend is built with React and TypeScript.

---

# Tech Stack

## Backend
- Express.js
- TypeScript
- PostgreSQL
- Sequelize ORM
- Redis
- BullMQ
- Google OAuth
- JWT Authentication
- Nodemailer
- Ethereal Email

## Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Hook Form
- Axios

---

# Backend Setup

## Prerequisites

- Node.js
- PostgreSQL
- Redis
- Docker (optional, for Redis)

## Installation

```bash
git clone <repository-url>

cd backend

npm install
```

## Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=

DATABASE_URL=

REDIS_URL=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

JWT_SECRET=

JWT_EXPIRES_IN=

MAX_EMAILS_PER_HOUR=

MIN_DELAY_BETWEEN_EMAILS_MS=

WORKER_CONCURRENCY=
```

## Start Redis

Using Docker:

```bash
docker compose up -d
```

## Run Backend

```bash
npm run dev
```

Starting the backend automatically:

- Connects to PostgreSQL
- Connects to Redis
- Creates the BullMQ worker
- Restores pending scheduled emails
- Starts the Express server

---

# Frontend Setup

```bash
cd frontend

npm install
```

Create a `.env` file

```env
VITE_API_BASE_URL=http://localhost:4000/api

VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
```

Run the frontend

```bash
npm run dev
```

---

# Ethereal Email Setup

This project uses Ethereal Email for development and testing.

1. Create an Ethereal account.
2. Copy the generated SMTP credentials.
3. Add them to the backend `.env` file.

Emails are delivered to Ethereal instead of a real inbox.

For debugging, the worker logs an Ethereal Preview URL that can be opened in a browser to view the email.

---

# Architecture Overview

```
React Frontend
        │
        ▼
Express REST API
        │
        ▼
Controllers
        │
        ▼
Services
        │
        ▼
PostgreSQL
        │
        ▼
BullMQ Queue
        │
        ▼
Redis
        │
        ▼
BullMQ Worker
        │
        ▼
Nodemailer
        │
        ▼
Ethereal SMTP
```

---

# Scheduling Workflow

1. User logs in using Google OAuth.
2. User uploads a CSV containing recipient email addresses.
3. User enters the email subject, body, start time, delay, and hourly limit.
4. The backend creates a Scheduled Email record for each recipient.
5. Each email is added to BullMQ as a delayed job.
6. BullMQ automatically executes jobs at the scheduled time.
7. The worker sends the email using Nodemailer.
8. The email status is updated and an Email Log entry is created.

---

# Persistence After Restart

The system is designed to survive application restarts.

During startup:

- Database connection is established.
- Redis connection is restored.
- Pending scheduled emails are recovered.
- Missing delayed jobs are re-queued.
- Future emails continue processing without user intervention.

This ensures scheduled emails are not lost after restarting the application.

---

# Rate Limiting

The system enforces a configurable hourly sending limit.

- Configurable using environment variables.
- Redis-backed counters ensure consistency across multiple workers.
- When the hourly limit is exceeded:
  - Emails are not dropped.
  - Emails are not permanently failed.
  - Jobs are delayed and rescheduled into the next available time window.

This satisfies the assignment requirement for persistent distributed rate limiting.

---

# Worker Concurrency

BullMQ workers support configurable concurrency.

```env
WORKER_CONCURRENCY=5
```

The worker processes multiple jobs concurrently while respecting the configured rate limit.

---

# Delay Between Emails

A configurable delay is enforced between consecutive email sends.

```env
MIN_DELAY_BETWEEN_EMAILS_MS=2000
```

BullMQ's limiter ensures emails are not sent faster than the configured rate.

---

# Idempotency

To prevent duplicate email delivery:

- Sent emails are marked with status `sent`.
- Before sending, the worker verifies that the email has not already been processed.
- Duplicate jobs are ignored.

This guarantees that the same scheduled email is never sent more than once.

---

# Backend Features

- Google OAuth Authentication
- JWT Authentication
- Email Scheduling
- Delayed Jobs using BullMQ
- Redis Queue
- Worker Concurrency
- Configurable Delay Between Emails
- Redis-backed Hourly Rate Limiting
- Automatic Recovery After Restart
- Idempotent Email Processing
- Scheduled Emails API
- Sent Emails API
- CSV Upload & Parsing
- Email Logging
- Multiple Sender Support

---

# Frontend Features

- Google Login
- Protected Routes
- Dashboard
- User Profile Header
- Logout
- Compose Email
- CSV Upload
- Recipient Count Preview
- Configure Start Time
- Configure Delay
- Configure Hourly Limit
- Scheduled Emails Table
- Sent Emails Table
- Loading States
- Empty States
- Error Handling
- Responsive UI

---

# Project Structure

## Backend

```
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── queues/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── workers/
│   └── app.ts
```

## Frontend

```
frontend/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── types/
│   └── App.tsx
```

---

# Assumptions

- Ethereal Email is used for development.
- PostgreSQL is used as the primary database.
- Redis stores BullMQ queues and rate-limiting counters.
- Google OAuth is used for authentication.
- CSV files contain valid email addresses.

---

- Restart persistence
- Rate limiting behavior
- Worker processing
