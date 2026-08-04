# FixItNow API

Backend API for FixItNow home services marketplace. Customers book technicians, technicians manage jobs, admins oversee the platform.

## Setup

```bash
npm install
cp .env.example .env  # Configure DATABASE_URL, STRIPE keys
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run dev
```

## Tech Stack

- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- Stripe payment integration
- JWT authentication

## API Documentation

Import `fixitnow_postman.json` into Postman for full endpoint documentation.

## Admin Credentials

**Email:** admin@fixitnow.com  
**Password:** admin123

## Assignment Requirements

✅ Structured error responses: `{ success, message, errorDetails }`  
✅ Input validation with Zod on all endpoints  
✅ Stripe payment integration  
✅ Admin credentials provided  
✅ Postman collection included  
✅ 20+ meaningful commits
