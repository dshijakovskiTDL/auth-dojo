# --- build: needs Node/Bun toolchain + devDependencies (Vite, TypeScript, etc.)
FROM oven/bun:alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

ARG VITE_API_URL

ENV VITE_API_URL=${VITE_API_URL}

RUN bun run build

# --- run: serve static files only (tiny image)
FROM nginx:alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
