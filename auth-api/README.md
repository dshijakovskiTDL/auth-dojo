# Auth 🥷 Dojo - Backend

## Setup

Install dependencies:

```sh
bun install
```

## Environment Variables

The application uses the following environment variables:

| Variable         | Description                                                                         |
| ---------------- | ----------------------------------------------------------------------------------- |
| `JWT_SECRET`     | The secret key for signing JWT tokens                                               |
| `FRONTEND_URL`   | The URL of the frontend application. Default: `http://localhost:5173`               |
| `REDIS_PASSWORD` | The password for the Redis database                                                 |
| `REDIS_URL`      | The URL of the Redis database. Default: `redis://:${REDIS_PASSWORD}@localhost:6379` |

## Run

Run the API:

```sh
bun run dev
```

The API will be available at [http://localhost:3000](http://localhost:3000)
