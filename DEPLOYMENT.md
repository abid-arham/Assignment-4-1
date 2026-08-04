# Deployment Guide

## Vercel Deployment

```bash
npm install -g vercel
vercel login
vercel --prod
```

## Environment Variables

Configure these in Vercel dashboard:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_ACCESS_SECRET` - Random secret for JWT
- `JWT_REFRESH_SECRET` - Random secret for refresh tokens  
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `BCRYPT_SALT_ROUNDS=12`

## Post-Deployment

1. Run migrations: `npx prisma migrate deploy`
2. Seed database: `npm run seed`
3. Configure Stripe webhook endpoint: `https://your-domain.vercel.app/api/payments/webhook`
4. Test admin login with credentials from CREDENTIALS.md

## Stripe Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-api.vercel.app/api/payments/webhook`
3. Select event: `checkout.session.completed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`
