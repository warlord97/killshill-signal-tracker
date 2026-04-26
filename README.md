# KillShill Signal Tracker

A full-stack trading signal tracking application with live Binance price integration, automated status logic, and a real-time dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | PostgreSQL (Neon DB) |
| ORM | Prisma |
| Price Feed | Binance Public REST API |

---

## Project Structure

```
killshill-signal-tracker/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Prisma client singleton
│   │   ├── controllers/
│   │   │   └── signalController.js  # Request/response handlers
│   │   ├── services/
│   │   │   ├── signalService.js   # Business logic + DB operations
│   │   │   ├── binanceService.js  # Live price fetching
│   │   │   └── statusService.js   # Status evaluation + ROI calculation
│   │   ├── routes/
│   │   │   └── signalRoutes.js    # Express route definitions
│   │   ├── middlewares/
│   │   │   └── errorHandler.js    # Global error handler
│   │   └── app.js                 # Express app entry point
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── signalApi.js       # All Axios API calls
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Badge.jsx      # Status badge component
│   │   │   │   ├── Loader.jsx     # Loading spinner
│   │   │   │   └── EmptyState.jsx # Empty dashboard state
│   │   │   ├── dashboard/
│   │   │   │   ├── StatsBar.jsx   # Summary statistics cards
│   │   │   │   ├── SignalTable.jsx # Main signals table
│   │   │   │   └── SignalRow.jsx  # Individual signal row
│   │   │   └── form/
│   │   │       ├── SignalForm.jsx  # Create signal form
│   │   │       └── FormField.jsx  # Reusable field wrapper
│   │   ├── hooks/
│   │   │   ├── useSignals.js      # Fetch + 15s auto-refresh
│   │   │   └── useCountdown.js    # Expiry countdown timer
│   │   ├── utils/
│   │   │   ├── formatters.js      # Price, ROI, date formatters
│   │   │   └── validators.js      # Client-side form validation
│   │   ├── constants/
│   │   │   └── index.js           # API URL, refresh interval
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── KillShill_SignalTracker.postman_collection.json
└── README.md
```

---

## Setup Instructions

### Prerequisites

Make sure you have the following installed:

- Node.js v18 or higher
- npm v9 or higher
- A free [Neon.tech](https://neon.tech) account for PostgreSQL

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/killshill-signal-tracker.git
cd killshill-signal-tracker
```

---

### 2. Database Setup (Neon PostgreSQL)

**Step 1** — Go to [neon.tech](https://neon.tech) and create a free account.

**Step 2** — Create a new project and name it `killshill`.

**Step 3** — Copy your connection string from the Neon dashboard. It looks like:
```
postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Step 4** — Create the backend `.env` file:
```bash
cd backend
cp .env.example .env
```

**Step 5** — Paste your connection string into `backend/.env`:
```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
PORT=5000
```

**Step 6** — Push the Prisma schema to your database:
```bash
cd backend
npx prisma db push
```

You should see:
```
✅ Your database is now in sync with your Prisma schema.
```

**Step 7 (Optional)** — Open Prisma Studio to visually inspect your database:
```bash
npx prisma studio
```

---

### 3. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Server starts at: `http://localhost:5000`

Verify it's running:
```bash
curl http://localhost:5000
# Response: { "message": "KillShill Signal Tracker API is running" }
```

---

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the dev server:
```bash
npm run dev
```

App opens at: `http://localhost:5173`

---

### 5. Running Both Together

Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

---

## Database Schema

```prisma
enum Direction {
  BUY
  SELL
}

enum SignalStatus {
  OPEN
  TARGET_HIT
  STOPLOSS_HIT
  EXPIRED
}

model Signal {
  id           Int          @id @default(autoincrement())
  symbol       String                          -- Trading pair e.g. BTCUSDT
  direction    Direction                       -- BUY or SELL
  entry_price  Decimal      @db.Decimal(20, 8) -- Signal entry price
  stop_loss    Decimal      @db.Decimal(20, 8) -- Stop loss level
  target_price Decimal      @db.Decimal(20, 8) -- Target price level
  entry_time   DateTime                        -- When signal becomes active
  expiry_time  DateTime                        -- Signal expiry (after entry_time)
  status       SignalStatus @default(OPEN)     -- Current signal status
  realized_roi Decimal?     @db.Decimal(10, 2) -- Nullable, set on resolution
  created_at   DateTime     @default(now())    -- Auto-set on creation
}
```

**Schema Design Decisions:**
- `DECIMAL(20, 8)` for prices — crypto requires high precision
- `realized_roi` is nullable — only populated when signal resolves
- ENUMs for `direction` and `status` — enforces valid values at DB level
- `created_at` auto-set — no manual input needed

---

## API Documentation

**Base URL:** `http://localhost:5000`

All responses follow this structure:
```json
{
  "success": true | false,
  "data": { } | [ ]
}
```

Error responses:
```json
{
  "success": false,
  "error": "Human readable error message"
}
```

---

### POST `/api/signals`
Create a new trading signal.

**Request Body:**
```json
{
  "symbol": "BTCUSDT",
  "direction": "BUY",
  "entry_price": 90000,
  "stop_loss": 85000,
  "target_price": 95000,
  "entry_time": "2026-04-25T10:00:00Z",
  "expiry_time": "2026-04-30T10:00:00Z"
}
```

**Validation Rules:**
- All fields are required
- `direction` must be `BUY` or `SELL`
- **BUY:** `stop_loss` < `entry_price` < `target_price`
- **SELL:** `target_price` < `entry_price` < `stop_loss`
- `expiry_time` must be after `entry_time`
- `entry_time` cannot be more than 24 hours in the past

**Responses:**

| Status | Description |
|---|---|
| 201 | Signal created successfully |
| 400 | Validation error — returns specific error message |

**201 Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "symbol": "BTCUSDT",
    "direction": "BUY",
    "entry_price": "90000",
    "stop_loss": "85000",
    "target_price": "95000",
    "entry_time": "2026-04-25T10:00:00.000Z",
    "expiry_time": "2026-04-30T10:00:00.000Z",
    "status": "OPEN",
    "realized_roi": null,
    "created_at": "2026-04-25T12:00:00.000Z"
  }
}
```

---

### GET `/api/signals`
Retrieve all signals with live Binance prices and evaluated statuses.

**How it works:**
1. Fetches all signals from database
2. Batch fetches live prices from Binance for all OPEN signals
3. Evaluates each OPEN signal status against live price
4. Persists any status changes to DB immediately
5. Returns enriched response with `current_price` and `roi`

**Response:**

| Status | Description |
|---|---|
| 200 | Returns array of all signals |

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "symbol": "BTCUSDT",
      "direction": "BUY",
      "entry_price": "90000",
      "stop_loss": "85000",
      "target_price": "95000",
      "status": "OPEN",
      "realized_roi": null,
      "current_price": 92500.45,
      "roi": 2.78
    }
  ]
}
```

**Notes:**
- `current_price` is live for OPEN signals, `null` for resolved signals
- `roi` uses `realized_roi` for resolved signals, computed live for OPEN signals
- Results ordered by `created_at` descending

---

### GET `/api/signals/:id`
Retrieve a single signal by ID.

**Parameters:**
- `id` — Signal ID (integer)

**Responses:**

| Status | Description |
|---|---|
| 200 | Signal found and returned |
| 404 | Signal not found |

```json
{
  "success": true,
  "data": {
    "id": 1,
    "symbol": "BTCUSDT",
    "direction": "BUY",
    "status": "STOPLOSS_HIT",
    "realized_roi": "-13.69",
    "current_price": null,
    "roi": -13.69
  }
}
```

---

### DELETE `/api/signals/:id`
Delete a signal permanently.

**Parameters:**
- `id` — Signal ID (integer)

**Responses:**

| Status | Description |
|---|---|
| 204 | Deleted successfully (empty body) |
| 404 | Signal not found |

---

### GET `/api/signals/:id/status`
Get the current live status of a signal.

**Parameters:**
- `id` — Signal ID (integer)

**Responses:**

| Status | Description |
|---|---|
| 200 | Returns live status data |
| 404 | Signal not found |

```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "OPEN",
    "current_price": 92500.45,
    "roi": 2.78
  }
}
```

---

## Signal Status Logic

### Status Transitions

```
OPEN ──► TARGET_HIT    (price hits target level)
OPEN ──► STOPLOSS_HIT  (price hits stop loss level)
OPEN ──► EXPIRED       (expiry time passes without hitting either level)
```

Once a signal reaches any resolved state it is **locked forever** and will never change again.

### Evaluation Priority Order

```
1. Already resolved?     → Return current status (never change)
2. Expiry time passed?   → EXPIRED
3. Price hit target?     → TARGET_HIT
4. Price hit stop loss?  → STOPLOSS_HIT
5. None of the above?    → OPEN
```

### Direction-Aware Price Logic

**BUY Signal:**
```
current_price >= target_price  → TARGET_HIT
current_price <= stop_loss     → STOPLOSS_HIT
```

**SELL Signal:**
```
current_price <= target_price  → TARGET_HIT
current_price >= stop_loss     → STOPLOSS_HIT
```

### ROI Formula

**BUY ROI:**
```
(current_price - entry_price) / entry_price × 100
```

**SELL ROI:**
```
(entry_price - current_price) / entry_price × 100
```

ROI is always displayed to **2 decimal places**.

---

## Architecture Explanation

### Overview

KillShill Signal Tracker follows a classic **3-tier architecture** — frontend, backend, and database — with a hybrid status evaluation strategy that avoids the complexity of a separate background job.

```
┌─────────────────────────────────────────────────────┐
│                     FRONTEND                         │
│         React + Tailwind (Vite, port 5173)           │
│                                                      │
│  useSignals hook → setInterval (15s) → GET /signals  │
│  SignalForm → POST /signals                          │
│  SignalTable → renders live data                     │
└────────────────────┬────────────────────────────────┘
                     │ HTTP (Axios)
┌────────────────────▼────────────────────────────────┐
│                     BACKEND                          │
│           Node.js + Express (port 5000)              │
│                                                      │
│  Routes → Controllers → Services                     │
│                                                      │
│  signalService.js  ← core orchestration              │
│  statusService.js  ← pure business logic             │
│  binanceService.js ← external price feed             │
└────────┬──────────────────────────┬─────────────────┘
         │ Prisma ORM               │ Axios HTTP
┌────────▼───────────┐   ┌──────────▼──────────────────┐
│     DATABASE        │   │      BINANCE PUBLIC API      │
│  PostgreSQL (Neon)  │   │  GET /api/v3/ticker/price   │
│  Hosted on cloud    │   │  No API key required         │
└────────────────────┘   └─────────────────────────────┘
```

### Hybrid Status Evaluation (Key Design Decision)

Rather than running a separate cron job process, status evaluation is triggered **on every GET /api/signals request** — which the frontend calls every 15 seconds. This approach:

1. **Fetches** all OPEN signals from the database
2. **Batch fetches** live Binance prices (one call per unique symbol, not per signal)
3. **Evaluates** each signal against its target and stop loss
4. **Persists** any status changes and `realized_roi` to the database immediately
5. **Returns** enriched response with live prices and ROI

This means status transitions are **persistent** — once a signal hits its target, that fact is written to the database and can never be reversed, even if the price moves back.

### Separation of Concerns

| Layer | Responsibility |
|---|---|
| `routes/` | Define URL patterns and HTTP methods only |
| `controllers/` | Handle req/res, input validation, HTTP status codes |
| `services/signalService` | Orchestrate DB + Binance + status evaluation |
| `services/statusService` | Pure functions — status logic and ROI math |
| `services/binanceService` | Binance API communication only |
| `config/db.js` | Single Prisma client instance shared across app |

### Frontend Architecture

The frontend is built around two custom hooks:

- **`useSignals`** — manages the full data lifecycle: initial fetch, 15-second polling, error state, and manual refresh trigger
- **`useCountdown`** — provides a live countdown timer per signal row without causing full re-renders

All API calls are centralized in `api/signalApi.js` — no component ever calls Axios directly. All formatting logic lives in `utils/formatters.js` — no component does math or string manipulation inline.

### Why These Technology Choices

- **Neon PostgreSQL** — Serverless Postgres with a free tier, zero infrastructure management, and instant setup via connection string
- **Prisma ORM** — Type-safe queries, auto-generated client, readable schema definition, and easy migrations
- **Binance Public API** — No API key required for price ticker data, reliable and free
- **Vite** — Significantly faster dev server and build times compared to Create React App
- **Tailwind CSS** — Utility-first styling keeps component files self-contained with no separate CSS files to manage

---

## Postman Collection

A complete Postman collection is included in the root of the repository:

```
KillShill_SignalTracker.postman_collection.json
```

**To import:**
1. Open Postman
2. Click **Import**
3. Select the collection JSON file
4. Set the `baseUrl` variable to `http://localhost:5000`

The collection includes all 5 endpoints with valid and invalid test cases, example responses, and auto-saved ID variables for chained requests.

---

## Environment Variables

**Backend (`backend/.env`):**
```env
DATABASE_URL="your_neon_postgresql_connection_string"
PORT=5000
```

**Frontend (`frontend/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## Available Scripts

**Backend:**
```bash
npm run dev     # Start with nodemon (auto-reload)
npm run start   # Start without auto-reload
```

**Frontend:**
```bash
npm run dev     # Start Vite dev server
npm run build   # Build for production
npm run preview # Preview production build
```

---

*Built for KillShill AI Engineering Assignment 2026*