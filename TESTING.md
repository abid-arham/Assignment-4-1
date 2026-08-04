# API Testing Guide

## Quick Start

1. Import `fixitnow_postman.json` into Postman
2. Set `base_url` variable to your server (default: `http://localhost:8080`)
3. Login as admin to get JWT token
4. Set `token` variable with the returned `accessToken`

## Test Scenarios

### 1. Customer Flow
- Register as CUSTOMER
- Login and copy token
- Browse services: `GET /api/services`
- Create booking: `POST /api/bookings`
- Create payment: `POST /api/payments/create`
- Complete payment via Stripe checkout URL
- Leave review after job completion

### 2. Technician Flow
- Register as TECHNICIAN  
- Update profile: `PUT /api/technician/profile`
- Set availability: `PUT /api/technician/availability`
- View bookings: `GET /api/technician/bookings`
- Accept booking: `PATCH /api/technician/bookings/:id`

### 3. Admin Flow
- Login with admin@fixitnow.com / admin123
- View all users: `GET /api/admin/users`
- Ban user: `PATCH /api/admin/users/:id`
- Create category: `POST /api/admin/categories`

## Validation Testing

All POST/PUT/PATCH endpoints validate input. Try sending:
- Missing required fields → 400 error
- Invalid UUIDs → 400 error  
- Invalid email format → 400 error
- Invalid enum values → 400 error

Error format: `{ success: false, message: "...", errorDetails: [...] }`
