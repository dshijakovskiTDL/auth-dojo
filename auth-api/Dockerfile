FROM oven/bun:alpine AS base

WORKDIR /app

FROM base AS builder

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile --production

COPY . .

RUN bun run build

FROM base AS runner

COPY --from=builder /app/dist /app/dist

EXPOSE 3000

CMD ["bun", "dist/index.js"]
