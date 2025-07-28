local-run-build:
	docker-compose -f local.yaml up --build 

local-run:
	docker-compose -f local.yaml up

local-down:
	docker-compose -f local.yaml down 

local-down-v:
	docker-compose -f local.yaml down -v --remove-orphans

migrate-up:
	docker-compose -f local.yaml exec app pnpm run migrate:up

migrate:
	docker-compose -f local.yaml exec app pnpm run migrate:latest
