API_SERVICE_NAME=super_backend
DB_SERVICE_NAME=super_mysqldb

DEV_DOCKER_COMPOSE_FILE=docker-compose.dev.yml
PROD_DOCKER_COMPOSE_FILE=docker-compose.yml

.PHONY: up
up:
	@docker-compose -f ${DEV_DOCKER_COMPOSE_FILE} up

.PHONY: up-silent
up-silent:
	@docker-compose -f ${DEV_DOCKER_COMPOSE_FILE} up -d

.PHONY: build
build:
	@docker-compose -f ${DEV_DOCKER_COMPOSE_FILE} build

.PHONY: down
down:
	@docker-compose down  --remove-orphans

.PHONY: logs
logs:
	@docker-compose logs ${API_SERVICE_NAME}

.PHONY: shell
shell:
	@docker-compose exec ${API_SERVICE_NAME} bash

.PHONY: db-start
db-start:
	@docker-compose exec ${API_SERVICE_NAME} npx prisma generate

.PHONY: db-migrate
db-migrate:
	@docker-compose exec ${API_SERVICE_NAME} npx prisma migrate dev

.PHONY: db-migrate-create
db-migrate-create:
	@docker-compose exec ${API_SERVICE_NAME} npx prisma migrate dev --name ${NAME}

.PHONY: db-seed
db-seed:
	@docker-compose exec ${API_SERVICE_NAME} node dist/prisma/seed.js

.PHONY: db-shell
db-shell:
	@docker-compose exec -it ${DB_SERVICE_NAME} mysql -uroot -proot -D ufam-dev

.PHONY: deploy
deploy: down
	git pull && \
	docker-compose -f ${PROD_DOCKER_COMPOSE_FILE} up --build --remove-orphans -d && \
	echo "Deploy concluded successfuly"
