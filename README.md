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

## Assignment Requirements

✅ Structured error responses: `{ success, message, errorDetails }`  
✅ Input validation with Zod on all endpoints  
✅ Stripe payment integration  
✅ Admin credentials provided  
✅ Postman collection included  
✅ 20+ meaningful commits

---

## Admin Credentials

**Email:** admin@fixitnow.com  
**Password:** admin123

Use these credentials to login via POST `/api/auth/login`

---

## API Testing Guide

### Quick Start

1. Import `fixitnow_postman.json` into Postman
2. Set `base_url` variable to your server (default: `http://localhost:8080`)
3. Login as admin to get JWT token
4. Set `token` variable with the returned `accessToken`

### Test Scenarios

#### 1. Customer Flow
- Register as CUSTOMER
- Login and copy token
- Browse services: `GET /api/services`
- Create booking: `POST /api/bookings`
- Create payment: `POST /api/payments/create`
- Complete payment via Stripe checkout URL
- Leave review after job completion

#### 2. Technician Flow
- Register as TECHNICIAN  
- Update profile: `PUT /api/technician/profile`
- Set availability: `PUT /api/technician/availability`
- View bookings: `GET /api/technician/bookings`
- Accept booking: `PATCH /api/technician/bookings/:id`

#### 3. Admin Flow
- Login with admin@fixitnow.com / admin123
- View all users: `GET /api/admin/users`
- Ban user: `PATCH /api/admin/users/:id`
- Create category: `POST /api/admin/categories`

### Validation Testing

All POST/PUT/PATCH endpoints validate input. Try sending:
- Missing required fields → 400 error
- Invalid UUIDs → 400 error  
- Invalid email format → 400 error
- Invalid enum values → 400 error

Error format: `{ success: false, message: "...", errorDetails: [...] }`

---

## Deployment Guide

### Vercel Deployment

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Environment Variables

Configure these in Vercel dashboard:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_ACCESS_SECRET` - Random secret for JWT
- `JWT_REFRESH_SECRET` - Random secret for refresh tokens  
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `BCRYPT_SALT_ROUNDS=12`

### Post-Deployment

1. Run migrations: `npx prisma migrate deploy`
2. Seed database: `npm run seed`
3. Configure Stripe webhook endpoint: `https://your-domain.vercel.app/api/payments/webhook`
4. Test admin login with credentials from Admin Credentials section above

### Stripe Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-api.vercel.app/api/payments/webhook`
3. Select event: `checkout.session.completed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`
