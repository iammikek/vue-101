# vue-101 (*-101 Vue SPA client)

Step-by-step **Vue 3 + TypeScript** SPA for the *-101 items API — same JSON contract as [fastAPI-101](https://github.com/iammikek/fastAPI-101), [nest-101](https://github.com/iammikek/nest-101), and [express-101](https://github.com/iammikek/express-101).

**Audience:** Frontend developers learning how a Laravel-style API maps to a browser SPA (JWT auth, categories, paginated items, stats).

## API coverage

| Area | Endpoints | UI |
|------|-----------|-----|
| Auth | register, login, me | `/login` |
| Categories | Full CRUD | `/categories` |
| Items | List (filters, pagination), detail, create, edit, delete | `/items` |
| Stats | `/items/stats/summary` | `/stats` |

Writes use **JWT Bearer** tokens. Mock mode works without signing in; live mode requires login for mutations.

## Quick start

```bash
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173

## Run against a backend

```bash
# Terminal 1
cd ../fastAPI-101
uvicorn main:app --reload --port 8000

# Terminal 2
cd ../vue-101
# set VITE_USE_MOCK=false in .env
npm run dev
```

Register or sign in, then create categories and items.

## Build

```bash
npm run build
npm run preview
```

## Laravel mapping

| Laravel | Vue SPA |
|---------|---------|
| Sanctum token | JWT in `Authorization: Bearer` |
| Blade | Vue SFCs + Vue Router |
| Form Request | Client validation + API errors |
| Eloquent relations | `category_id` + nested `category` |
| `paginate()` | `skip` / `limit` + load more |

## Related repos

- **flutter-101** — mobile/desktop client
- **fastAPI-101**, **nest-101**, **express-101**, **go-101** — API backends
