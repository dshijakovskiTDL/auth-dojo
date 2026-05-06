# Auth 🥷 Dojo

Learning project: different auth patterns in a small full stack app.

| Auth style                       | Status |
| -------------------------------- | ------ |
| Token (access + refresh cookies) | Done   |
| Session (cookie)                 | —      |
| OAuth (Google / GitHub)          | —      |

## Stack

**Frontend:** [Vite](https://vitejs.dev/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [React Router](https://reactrouter.com/), [React Query](https://tanstack.com/query/latest), [Tailwind](https://tailwindcss.com/)

**Backend:** [Bun](https://bun.sh/), [Hono](https://hono.dev/), [JWT](https://jwt.io/), [Redis](https://redis.io/), [Valibot](https://valibot.dev/)

## Setup (local dev)

Docker required for Redis. From the **repo root**:

```sh
cp auth-api/.env.example auth-api/.env
cp auth-client/.env.example auth-client/.env
```

Edit `auth-api/.env`: set `JWT_SECRET`, `REDIS_PASSWORD`, and `REDIS_URL` (same password in both), e.g.  
`REDIS_URL=redis://:${REDIS_PASSWORD}@localhost:6379`

Edit `auth-client/.env` if the API is not at `http://localhost:3000` (`VITE_API_URL`).

Then:

```sh
make redis-dev      # Redis in Docker
make api-dev        # API — other terminal
make client-dev     # frontend — other terminal
```

- App: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:3000](http://localhost:3000)
- Health: [http://localhost:3000/health](http://localhost:3000/health)

## Makefile

| Command             | What it does                                |
| ------------------- | ------------------------------------------- |
| `make redis-dev`    | Start Redis (`docker-compose.redis.yml`)    |
| `make redis-stop`   | Stop Redis (keeps data volume)              |
| `make redis-remove` | Stop Redis and delete the volume            |
| `make api-dev`      | Run `auth-api` with `bun dev`               |
| `make client-dev`   | Run `auth-client` with `bun dev`            |
| `make start`        | Full stack in Docker (`docker-compose.yml`) |
| `make stop`         | `docker compose down`                       |
| `make logs`         | Tail full-stack logs                        |
| `make build`        | Build full-stack images                     |

Token flow details: `[auth-guides/token-auth.md](auth-guides/token-auth.md)`
