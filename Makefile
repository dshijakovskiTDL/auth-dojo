start:
	docker compose up -d --build

redis-dev:
	docker compose -f docker-compose.redis.yml up -d --build

redis-stop:
	docker compose -f docker-compose.redis.yml down

redis-remove:
	docker compose -f docker-compose.redis.yml down -v

api-dev:
	cd auth-api && bun dev

client-dev:
	cd auth-client && bun dev

stop:
	docker compose down

logs:
	docker compose logs -f

build:
	docker compose build
