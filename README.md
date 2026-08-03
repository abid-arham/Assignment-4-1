# FixItNow API

Starter structure for the FixItNow home-services marketplace backend. Application features and database models are intentionally not implemented.

## Quick start

1. Install packages: `npm install`
2. Copy `.env.example` to `.env` and fill in the values.
3. Define your Prisma models in `prisma/schema.prisma`.
4. Generate the client: `npm run prisma:generate`
5. Start development: `npm run dev`

## Layout

- `src/modules` — feature modules, each keeping its own routes, controller, service, and validation files
- `src/shared` — cross-module middleware, configuration, types, and utilities
- `prisma` — PostgreSQL/Prisma setup

Each module is already mounted under `/api` in `src/modules/index.ts`.
