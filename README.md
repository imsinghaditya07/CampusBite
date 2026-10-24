# CampusBite — India-Scale Campus Food Operating System

**Tap. Order. Eat.**

CampusBite is an India-wide digital operating system for college campus food ecosystems, connecting students, faculty, canteen owners, kitchen staff, college administrators, and nationwide platform admins across the multi-tenant hierarchy:

`India → State → District → City → University → College → Campus → Canteen → Kitchen → Kitchen Station → Pickup Counter`

---

## 🚀 Key Production System Features

### 1. Student Food Ordering & Live Queue
- **All-India College Directory & GPS Map**: 30+ onboarded Indian colleges across 10 states + Custom typed college creator with real-time state sync.
- **12-Region Food Catalog**: 12 comprehensive categories (North Indian, South Indian, West Indian, East Indian, Street Food, Biryani, Chinese, Beverages, Snacks, Desserts, Combos, Healthy) with real nutrition data, spice levels, and authentic imagery.
- **Authoritative Server-Side Pricing**: Server calculates itemized subtotals, coupon discounts, and 5% GST, rejecting client-side price tampering.
- **Smart Pickup Slot Selector**: Enforces express pickup time slots (e.g. 12:00 - 12:15 PM).
- **Razorpay Standard Checkout**: Native server-side order creation (`amount` in integer paise), timing-safe HMAC SHA-256 signature verification, and raw-body webhook processing.
- **Live Order Tracker & Real-Time Socket.IO**: Real-time order state machine (`PAID` → `ACCEPTED` → `PREPARING` → `READY` → `PICKED_UP`) with live queue countdowns.
- **Cryptographic QR Pickup**: Securely signed QR tokens with double-pickup prevention.

### 2. Canteen Owner Command Center
- **Live Operational Dashboard**: Real-time order stream, daily GMV revenue KPIs, average preparation speed metrics.
- **Live Menu & Stock Manager**: Instant price and availability edits with instant Socket.IO broadcast (`menu.item_updated`) to all browsing students.
- **Raw Ingredient Inventory**: Stock thresholds, reorder alerts, supplier tracking.
- **AI Canteen Copilot**: Natural language query engine answering preparation plan queries and margin optimization.

### 3. Kitchen Display System (KDS)
- **Tablet & Mobile Kanban Interface**: 3-column workflow board (`NEW ORDERS / PAID`, `PREPARING IN KITCHEN`, `READY AT COUNTER`).
- **One-Touch Status Advancement**: One-tap transition notifying the student tracker in real-time.

### 4. College Admin Governance Portal
- Vendor application approval desk, campus event manager, hygiene & safety score compliance (98/100).

### 5. Super Admin India Control Tower
- Geographic tree overview across Indian States (MH, KA, DL, TN, UP, WB, RJ, GJ, PB) and Universities (IIT Bombay, IISc, DU, etc.).
- Nationwide GMV tracking, 100% operational system health monitors, platform audit log stream.

---

## 💳 Razorpay Standard Checkout Flow

1. **Order Creation (`POST /api/v1/payments/razorpay-order`)**:
   - Server calculates total in integer paise (`₹140.00 = 14000 paise`).
   - Generates official Razorpay Order via `razorpay.orders.create(...)` with receipt `CB-ORDER-{internalId}`.
2. **Client Checkout**:
   - Frontend opens Razorpay Checkout with `keyId`, `razorpayOrderId`, `amount`, and `currency: 'INR'`.
3. **Signature Verification (`POST /api/v1/payments/verify`)**:
   - Server validates timing-safe HMAC SHA-256 signature:
     `HMAC_SHA256(razorpayOrderId + "|" + razorpayPaymentId, RAZORPAY_KEY_SECRET) === signature`.
   - Transitions order state to `PAID` and emits `order.created` to the Kitchen KDS.
4. **Server-to-Server Webhook (`POST /api/v1/payments/razorpay/webhook`)**:
   - Validates `x-razorpay-signature` against raw payload with `RAZORPAY_WEBHOOK_SECRET`.
   - Idempotently processes `payment.captured`, `payment.failed`, and `refund.processed`.
5. **Refunds (`POST /api/v1/payments/:id/refund`)**:
   - Full or partial refunds logged in the financial ledger and updated in database.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Vanilla CSS design tokens, Lucide Icons, Zustand, Socket.IO Client.
- **Backend API & Real-Time**: Node.js, Express, TypeScript, Prisma ORM, SQLite / PostgreSQL, Socket.IO server, JWT authentication, Razorpay Node SDK, Zod, bcryptjs.
- **AI Microservice**: Python 3.11, FastAPI, Uvicorn.
- **Database**: Prisma schema with 30+ relational entities (Users, Colleges, Canteens, Categories, FoodItems, Cart, Orders, Payments, Refunds, QR Tokens, Inventory, Coupons, Reviews, Complaints, AuditLogs).

---

## 🔑 Demo Persona Accounts

| Role | Email | Password | Primary Workflow |
| :--- | :--- | :--- | :--- |
| **Student** | `student@campusbite.in` | `Demo@1234` | Order food, select pickup slot, Razorpay payment, live queue & QR |
| **Canteen Owner** | `owner@campusbite.in` | `Demo@1234` | Edit prices & stock live, view GMV, AI Copilot |
| **Kitchen Staff** | `kitchen@campusbite.in` | `Demo@1234` | Tablet KDS order preparation board |
| **College Admin** | `collegeadmin@campusbite.in` | `Demo@1234` | Vendor approval & campus food policy governance |
| **Super Admin** | `superadmin@campusbite.in` | `Demo@1234` | India Control Tower, state/city GMV overview |

---

## 💻 Local Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Initialize Database & Seed Data**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

3. **Run Automated Test Suite**:
   ```bash
   npm run test --prefix apps/api
   # or: npx tsx apps/api/test/backend.test.ts
   ```

4. **Run Development Services**:
   - Next.js Web App: `http://localhost:3005` (`npm run dev:web`)
   - Express API & Socket.IO: `http://localhost:4000` (`npm run dev:api`)
   - Python FastAPI AI Engine: `http://localhost:8008` (`npm run dev:ai`)
