# Getting Fast at Vue

A step-by-step **Vue 3 + TypeScript** SPA client for the *-101 items API — same JSON contract as [fastAPI-101](https://github.com/iammikek/fastAPI-101), with parity to [flutter-101](https://github.com/iammikek/flutter-101) on the web.

**Audience:** Frontend developers learning how a Laravel-style API maps to a browser SPA (JWT auth, categories, paginated items, stats).

**Client-only:** This repo does not run a backend. Point it at any *-101 API (or use **mock mode** for UI work without a server).

---

## What's Included

1. **Vue 3 + Vite** — fast dev server and production build
2. **Pinia** — auth, items, categories, config stores
3. **Vue Router** — `/items`, `/categories`, `/stats`, `/login`, `/settings`
4. **JWT auth** — register, login, Bearer token on write endpoints
5. **Categories** — list, detail, create, edit, delete
6. **Items** — list with filters + pagination, detail, create, edit, delete
7. **Stats** — `GET /items/stats/summary`
8. **Mock mode** — in-memory fake API (default) for offline UI work
9. **Live mode** — calls a real *-101 backend via `VITE_BASE_URL`

---

## Quick Start

### Mock mode (no backend)

```bash
cd vue-101
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:5173** — browse items, categories, and stats with fake data. Writes work without signing in.

### Live mode (fastAPI-101)

```bash
# Terminal 1 — backend
cd ../fastAPI-101
uvicorn main:app --reload --port 8000

# Terminal 2 — SPA
cd ../vue-101
# .env: VITE_USE_MOCK=false, VITE_BASE_URL=http://localhost:8000
npm run dev
```

Register at `/login`, then create categories and items.

### Build

```bash
npm run build
npm run preview
```

---

## Project Structure

```
vue-101/
├── src/
│   ├── api/           # HTTP client + mock implementation
│   ├── stores/        # Pinia: auth, items, categories, config
│   ├── views/         # Route pages (items, categories, stats, login)
│   └── router/        # Vue Router routes
├── .env.example
├── package.json
└── vite.config.ts
```

---

## Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_BASE_URL` | `http://localhost:8000` | API root |
| `VITE_USE_MOCK` | `true` | Mock data vs live API |

---

## API Endpoints (client coverage)

| Path | Method | Auth | UI |
|------|--------|------|-----|
| `/` | GET | — | (health via API client) |
| `/health` | GET | — | (health via API client) |
| `/auth/register` | POST | — | `/login` (register) |
| `/auth/login` | POST | — | `/login` |
| `/auth/me` | GET | JWT | after sign-in |
| `/categories` | GET/POST | JWT on POST | `/categories` |
| `/categories/{id}` | GET/PATCH/DELETE | JWT on writes | detail + forms |
| `/items` | GET/POST | JWT on POST | `/items` + create |
| `/items/stats/summary` | GET | — | `/stats` |
| `/items/{id}` | GET/PATCH/DELETE | JWT on writes | detail + edit |

Query params on `GET /items`: `skip`, `limit`, `category_id`, `name_contains`, `min_price`, `max_price`.

---

## Laravel → Vue Mapping

| Laravel | vue-101 |
|---------|---------|
| Sanctum personal access token | JWT `Authorization: Bearer` |
| Blade views | Vue SFCs + Vue Router |
| Form Request validation | Client validators + API 422 |
| Eloquent `category_id` | `category_id` + nested `category` |
| `paginate()` | `{ items, total, skip, limit }` + load more |
| `@auth` middleware | Pinia `authStore.canWrite` |

---

## *-101 Family

Full family list, ports, and clone-with-submodules: **[learning-101](https://github.com/iammikek/learning-101)**. Site catalogue: [automica.io/learning-101](https://automica.io/learning-101.html).

---

## Quick Reference

| Goal | Command |
|------|---------|
| Copy env | `cp .env.example .env` |
| Install | `npm install` |
| Dev server | `npm run dev` → http://localhost:5173 |
| Production build | `npm run build` |
| Preview build | `npm run preview` |
| Pair with API | Set `VITE_USE_MOCK=false`, `VITE_BASE_URL=http://localhost:8000` |
