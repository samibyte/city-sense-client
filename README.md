# City Sense — Client

Next.js front end for the City Sense API. Citizen service requests, resolver
assignments and payments.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4
· shadcn `base-nova` · TanStack Query · TanStack Form · Zod · ofetch · bun

## Requirements

Docker and Docker Compose. Everything runs in containers.

## Getting started

```bash
docker compose up -d
```

The stack starts four services:

| Service    | URL                     | Notes                                    |
| ---------- | ----------------------- | ---------------------------------------- |
| `client`   | http://localhost:3000   | Next.js dev server, hot reload           |
| `backend`  | http://localhost:5000   | Express API, also serves `/api/v1`       |
| `postgres` | `localhost:5432`        | Persistent data in the `postgres_data` volume |
| `redis`    | `localhost:6379`        | Password protected, OTP and rate limiting |

The API applies pending migrations on start and waits for them before booting,
so a cold start needs no manual step.

To load the demo data:

```bash
docker compose --profile seed up --exit-code-from seed seed
```

That is not idempotent — the seed inserts fixed rows, so a second run reports
duplicate key errors. Start from a clean volume instead:

```bash
docker compose down -v && docker compose up -d
```

Seeded accounts:

| Role     | Email                   | Password    |
| -------- | ----------------------- | ----------- |
| Admin    | `admin@citysense.com`   | `Admin@123` |
| Resolver | `resolver@citysense.com`| `Resolver@123` |
| Citizen  | `citizen@citysense.com` | `Citizen@123` |

## Running the client without Docker

The API must still be reachable on `http://localhost:5000`, because the browser
calls it directly.

```bash
bun install
cp .env.example .env
bun run dev
```

## Scripts

| Script          | Purpose                                        |
| --------------- | ---------------------------------------------- |
| `bun run dev`   | Dev server with hot reload                     |
| `bun run build` | Static export to `out/`                        |
| `bun run lint`  | `biome check`                                  |
| `bun run format`| `biome format --write`                         |
| `bun run typecheck` | `next typegen && tsc --noEmit`             |

## Environment

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | API root including the version prefix, e.g. `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth web client ID. Must belong to the same GCP project as the API's `GOOGLE_CLIENT_ID`. |

See `.env.example`. Both are set in `docker-compose.yaml`, so no `.env` file is
needed to run with Docker.

`NEXT_PUBLIC_*` values are inlined at build time, so changing them requires a
rebuild, not just a restart.

## API conventions

- Every response is `{ success, statusCode, message, data, meta }`. Errors are
  `{ success: false, statusCode, message, errors }`. Neither is unwrapped, so
  read `data?.data`.
- `meta` is present only on paginated endpoints.
- `Decimal` columns (`Service.price`, `Payment.amount`) arrive as strings.
- Auth is cookie based. The API sets `httpOnly` cookies, and
  `apiClient` sends requests with `credentials: "include"`.
- On a `401`, `src/lib/apiClient.ts` refreshes the session once and replays the
  request. Auth endpoints are exempt so a failed login is never retried.

## Layout

```
src/
  api/         one module per resource; the only place endpoint paths appear
  app/         App Router pages and layouts
  components/  ui/ primitives, auth/ guards, forms and modules
  hooks/       TanStack Query hooks, one per API function
  lib/         apiClient, payment paths
  providers/   query, Google auth, tooltip
  routes/      sidebar configuration per role
  types/       domain types mirroring the Prisma schema
  utils/       shared helpers
  validation/  zod schemas mirroring the API's own schemas
```
