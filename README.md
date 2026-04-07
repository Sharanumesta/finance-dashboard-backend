# FinanceOS — Finance Dashboard Backend

A role-based financial data management system built with **Node.js**, **Express**, **PostgreSQL (Prisma ORM)**, and **React**.

The system supports **Admin**, **Analyst**, and **Viewer** roles with strict access control across user management, financial records, and dashboard analytics.

---

## Links

| Resource | URL |
|----------|-----|
| Live Demo | https://finace-dashboard-app.netlify.app |
| Postman Collection | https://documenter.getpostman.com/view/25239808/2sBXiri83k |

---

## Why This Project

Modern financial systems require secure multi-user access, role-based permissions, and efficient analytics computation. This project demonstrates clean backend architecture, strong RBAC (Role-Based Access Control), Prisma + PostgreSQL data modeling, and real-time dashboard analytics.

---

## Features

### Authentication & User Management
- JWT-based authentication
- Register and login
- Get profile via `/auth/me`
- Admin can create users, update roles, activate/deactivate accounts, and delete users

### Financial Records (Transactions)
- Create, update, and delete records (Admin only)
- View records (Analyst and Admin)
- Filter by type (INCOME / EXPENSE), category, and date range
- Pagination and sorting
- Soft delete using `isDeleted` flag

### Dashboard Analytics
- **Summary** — Total income, total expenses, net balance
- **Category Breakdown** — Income vs expense per category
- **Monthly Trends** — Month-over-month aggregated data
- **Weekly Trends** — ISO week-based aggregation
- **Recent Activity** — Latest N transactions

### Role-Based Access Control

| Role | Access |
|------|--------|
| Viewer | Dashboard only |
| Analyst | Dashboard + read transactions |
| Admin | Full access — users and transactions |

### Validation & Error Handling
- Input validation using `express-validator`
- Standard API response format
- Proper HTTP status codes

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js + Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Frontend | React (Vite) |
| Styling | Tailwind CSS |
| Charts | Recharts |
| API Testing | Postman |

---

## Architecture & Design

### Backend Structure

```
src/
├── controllers/
├── services/
├── routes/
├── middleware/
├── validators/
├── config/
├── utils/
└── index.js
```

### Separation of Concerns

| Layer | Responsibility |
|-------|----------------|
| Routes | API endpoint definitions |
| Controllers | Request/response handling |
| Services | Business logic |
| Middleware | Authentication and RBAC |
| Validators | Input validation |
| Prisma | Database access layer |

### Request Flow

```
Client Request
  │
  ├─ Router ─── URL prefix matching (/auth, /users, /transactions, /dashboard)
  │
  ├─ authenticate ─── Extract Bearer token → validate → inject user into request
  │
  ├─ authorize ─── Check user.role against allowed roles → 403 if denied
  │
  ├─ Validators ─── Sanitize and validate all fields → 400 on failure
  │
  ├─ Service Layer ─── Business logic and Prisma queries
  │
  └─ JSON Response ─── { success, message, data, meta } with appropriate status code
```

---

## API Endpoints

### Authentication — `/auth`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/auth/login` | Validate credentials, return JWT | Public |
| `POST` | `/auth/register` | Create new account | Public |
| `GET` | `/auth/me` | Get current user profile | Authenticated |

### User Management — `/users`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/users` | List all users (paginated) | Admin, Analyst |
| `GET` | `/users/:id` | Get user details | Authenticated |
| `POST` | `/users` | Create new user | Admin |
| `PATCH` | `/users/:id` | Update user name, role, or status | Admin |
| `DELETE` | `/users/:id` | Deactivate user (soft) | Admin |
| `PATCH` | `/users/change-password` | Change own password | Authenticated |

### Financial Records — `/transactions`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/transactions` | List records (filterable, paginated) | Analyst, Admin |
| `GET` | `/transactions/:id` | Get single record | Analyst, Admin |
| `POST` | `/transactions` | Create new record | Admin |
| `PATCH` | `/transactions/:id` | Partial update | Admin |
| `DELETE` | `/transactions/:id` | Soft delete (`isDeleted = true`) | Admin |

**Available Filters:** `type`, `category`, `startDate`, `endDate`, `userId` (admin only), `page`, `limit`, `sortBy`, `sortOrder`

### Dashboard Analytics — `/dashboard`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/dashboard/summary` | Total income, expenses, net balance, counts | Any role |
| `GET` | `/dashboard/categories` | Per-category income/expense breakdown | Any role |
| `GET` | `/dashboard/monthly` | Month-over-month trends | Any role |
| `GET` | `/dashboard/weekly` | ISO week-based trends | Any role |
| `GET` | `/dashboard/recent` | Most recent transactions (configurable limit) | Any role |

> All dashboard endpoints are user-scoped. Admins can append `?userId=<id>` for cross-user views.

### Example API Responses

**`GET /dashboard/summary`**
```json
{
  "success": true,
  "message": "Dashboard summary retrieved",
  "data": {
    "totalIncome": 113000.00,
    "totalExpenses": 35200.00,
    "netBalance": 77800.00,
    "transactionCount": {
      "income": 8,
      "expense": 4,
      "total": 12
    }
  }
}
```

**`GET /dashboard/categories`**
```json
{
  "success": true,
  "message": "Category breakdown retrieved",
  "data": [
    {
      "category": "Salary",
      "income": 90000.00,
      "expense": 0,
      "net": 90000.00,
      "transactionCount": 3
    },
    {
      "category": "Rent",
      "income": 0,
      "expense": 18000.00,
      "net": -18000.00,
      "transactionCount": 2
    }
  ]
}
```

**Error Response Format**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "amount", "message": "Amount must be a positive number" }
  ]
}
```

---

## Role-Based Access Control

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| View Dashboard | ✅ | ✅ | ✅ |
| View Transactions | ❌ | ✅ | ✅ |
| Create Transactions | ❌ | ❌ | ✅ |
| Update Transactions | ❌ | ❌ | ✅ |
| Delete Transactions | ❌ | ❌ | ✅ |
| View Users | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |

---

## Setup Instructions

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- PostgreSQL database (or Supabase)

### Backend

```bash
# 1. Enter server directory
cd server

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Set DATABASE_URL and JWT_SECRET

# 4. Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# 5. Seed demo data
node prisma/seed.js

# 6. Start dev server
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## Demo Credentials

All demo accounts use password: **`Password123!`**

| Role | Email |
|------|-------|
| Admin | admin@finance.com |
| Analyst | analyst@finance.com |
| Viewer | viewer@finance.com |

### Quick Test with cURL

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@finance.com","password":"Password123!"}'

# Get dashboard summary
curl http://localhost:3000/dashboard/summary \
  -H "Authorization: Bearer <your_token>"

# Create transaction (Admin only)
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{"amount":5000,"type":"INCOME","category":"Salary","date":"2026-04-01"}'
```

---

## Data Modeling

```
┌─────────────────────────┐
│         users           │
├─────────────────────────┤
│ id          UUID  PK    │
│ name        TEXT        │
│ email       TEXT UNIQUE │
│ password    TEXT        │
│ role        ENUM        │
│ status      ENUM        │
│ createdAt   TIMESTAMP   │
│ updatedAt   TIMESTAMP   │
└────────────┬────────────┘
             │ userId (FK)
             ▼
┌─────────────────────────┐
│      transactions       │
├─────────────────────────┤
│ id          UUID  PK    │
│ userId      UUID  FK    │
│ amount      DECIMAL     │
│ type        ENUM        │
│ category    TEXT        │
│ date        DATE        │
│ notes       TEXT        │
│ isDeleted   BOOLEAN     │
│ createdAt   TIMESTAMP   │
│ updatedAt   TIMESTAMP   │
└─────────────────────────┘
```

- One-to-many: **User → Transactions**
- Enum — `role`: `VIEWER | ANALYST | ADMIN`
- Enum — `status`: `ACTIVE | INACTIVE`
- Enum — `type`: `INCOME | EXPENSE`
- Soft delete via `isDeleted` flag

---

## Dashboard & Aggregation Logic

All analytics are computed using Prisma ORM aggregation — no manual in-memory calculations.

| Endpoint | Technique |
|----------|-----------|
| Summary | `prisma.aggregate` with `_sum` and `_count` filtered by type |
| Category Breakdown | `prisma.groupBy(category, type)` with income/expense separation |
| Monthly Trends | Date filtering + JavaScript month-key grouping |
| Weekly Trends | ISO week calculation in service layer |
| Recent Activity | `orderBy: { date: "desc" }` with `take` limit |

All dashboard endpoints respect role-based scoping — Analysts and Viewers see only their own data; Admins can query across all users.

---

## Validation Rules

| Field | Rules |
|-------|-------|
| email | Valid email format, normalized |
| password | Minimum 8 characters, one uppercase, one digit |
| amount | Positive number greater than 0 |
| type | Must be `INCOME` or `EXPENSE` |
| category | Required, max 100 characters |
| date | ISO 8601 format (`YYYY-MM-DD`) |
| role | Must be `VIEWER`, `ANALYST`, or `ADMIN` |
| page | Integer ≥ 1 |
| limit | Integer between 1 and 100 |

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error / bad request |
| 401 | Unauthenticated |
| 403 | Forbidden (insufficient role) |
| 404 | Resource not found |
| 409 | Conflict (e.g. email already in use) |
| 500 | Internal server error |

---

## Security Measures

| Measure | Implementation |
|---------|----------------|
| Authentication | JWT with expiry |
| Authorization | Role-based middleware on every protected route |
| Data Isolation | `userId` filtering for non-admin users |
| Soft Deletes | `isDeleted` preserves financial history |
| Input Validation | `express-validator` on all mutation endpoints |
| Password Security | `bcrypt` with 10 salt rounds |
| Account Control | `ACTIVE / INACTIVE` status on users |
| Timing Safety | Constant-time password comparison to prevent enumeration |

---

## Assumptions & Design Decisions

| Decision | Rationale | Tradeoff |
|----------|-----------|----------|
| Express over NestJS | Lightweight, flexible, demonstrates manual architecture | Less built-in structure |
| Prisma ORM | Type-safe queries, clean migrations, great DX | Slight abstraction overhead |
| PostgreSQL | Reliable relational DB well-suited for financial records | Requires provisioning |
| JWT (stateless) | Scalable, no server-side session store needed | Token revocation requires blocklist |
| Middleware RBAC | Centralized, readable, easy to extend | Slight coupling to Express middleware chain |
| Soft Deletes | Preserves financial audit history | All queries must filter `isDeleted: false` |
| Service Layer | Separates business logic from HTTP layer | More files; worth it for testability |
| Singleton Prisma client | Prevents connection pool exhaustion in dev (hot reload) | Global state |

---

## Possible Improvements

- Refresh token rotation with revocation support
- Fine-grained permissions (resource-level RBAC)
- Redis caching for dashboard aggregations
- Cursor-based pagination for large datasets
- Docker Compose setup for one-command local development
- Unit and integration test suite (Jest + Supertest)
- Audit log table for all mutation operations
- Advanced analytics — spending trends and forecasting

---

## Author

**Sharanu Mesta**
Built as part of a Backend Developer Intern assessment — April 2026.

---

## License

Submitted as part of an internship assessment. Not licensed for production use.