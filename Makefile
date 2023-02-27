up:
	npm start

build:
	npm run-script build

db:
	docker-compose up

db-start:
	npx prisma generate

db-migrate:
	npx prisma migrate dev

db-seed:
	node dist/prisma/seed.js
