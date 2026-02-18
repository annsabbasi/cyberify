# Cyberify Task — Google Form Clone

A Google-Form-like application built with a full-stack TypeScript setup, organized as a monorepo for better structure and maintainability.

---

## Project Overview

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite + TypeScript) |
| Backend | Node.js with Express (TypeScript) |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Package Manager | Bun |
| Validation | Custom middleware (backend) + client-side validation |
| Business Rule | A user can submit the form only once (email-based restriction) |

---

## Application Workflow

1. User fills in **Name**, **Email**, and **Message**
2. Frontend performs basic validation
3. Before submission, the system checks: `GET /api/submissions/check/:email`
4. If the email already exists → a dialog appears: *"You have already submitted this form."*
5. If not submitted → data is sent to `POST /api/submissions`
6. Backend validates the request via middleware, checks email uniqueness (Prisma + DB constraint), and stores the submission
7. Frontend shows a **success dialog** on submission, or an **error dialog** for duplicates and server errors

---

## Repository Structure (Monorepo)

```
cyberify/
├── src/                          # React frontend
│   ├── components/
│   │   ├── Dialog/
│   │   │   └── Dialog.tsx        # Reusable dialog for success, error, and info messages
│   │   └── Form/
│   │       └── FormField.tsx     # Reusable input component
│   ├── App.tsx                   # Main logic: form handling, API calls, validation, dialog control
│   ├── types.ts                  # Shared TypeScript interfaces
│   └── main.tsx                  # React app entry point
├── api/                          # Express backend
│   ├── src/
│   │   ├── index.ts              # Express server entry point
│   │   ├── routes/
│   │   │   └── submissions.ts    # GET /check/:email and POST / with duplicate prevention
│   │   └── middleware/
│   │       └── validation.ts     # Centralized validation for name, email, and message
│   └── prisma/
│       └── schema.prisma         # Submission model with unique email constraint
├── vite.config.ts                # Proxy configuration to backend
└── package.json                  # Root scripts to run both services together
```

> The backend base URL is globally configured via **Vite proxy**, so only endpoint paths are used in API calls.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/submissions/check/:email` | Check if email has already submitted |
| POST | `/api/submissions` | Submit the form (with duplicate prevention) |

---

## How to Run the Project

### 1. Clone the Repository

```bash
git clone git@github.com:annsabbasi/cyberify.git
cd cyberify
```

### 2. Backend Setup

```bash
cd api
bun install
```

Create a `.env` file inside `/api`:

```env
DATABASE_URL=your_supabase_connection_string
DIRECT_URL=your_direct_connection_string
PORT=3001
```

Run Prisma migrations:

```bash
bunx prisma generate
bunx prisma db push
```

Start the backend:

```bash
bun run dev
```

> Backend runs on: `http://localhost:3001`

---

### 3. Frontend Setup

From the root directory:

```bash
cd ..
bun install
bun run dev
```

> Frontend runs on: `http://localhost:5173`

---

## Alternatively — Run Both with a Single Command

The root `package.json` includes convenience scripts to manage both services together:

```bash
# Setup database (run once)
bun run db:setup

# Run frontend and backend simultaneously
bun run dev:all
```

> This uses `concurrently` to start both the Vite dev server and the Express API in a single terminal.

---

## Key Features

- Clean modular monorepo structure
- TypeScript across the full stack
- Email-based single submission enforcement
- Client-side and server-side validation
- Reusable React components
- Prisma ORM with Supabase (PostgreSQL)
- Proper error handling and user feedback

---

## GitHub Repository

[git@github.com:annsabbasi/cyberify.git](https://github.com/annsabbasi/cyberify)