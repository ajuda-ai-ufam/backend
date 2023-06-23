# Description

Rest API do projeto Super Monitoria desenvolvido no IComp com o apoio do SUPER.

# Prerequisites

Make sure you have the following dependencies installed:
- [Docker](https://docs.docker.com/engine/install/ubuntu/)
- [docker-compose](https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/How-to-install-Docker-and-docker-compose-on-Ubuntu)

Create a `.env` file with the envs on `.example.env`.

# Scripts

We use Makefile commands to run our scripts:

## Development

- Build docker images:
  ```bash
  make build
  ```

- Run database and API on wath mode:
  ```bash
  make up
  ```

- Run on silent mode:
  ```bash
  make up-silent
  ```

- Stop api and database:
  ```bash
  make down
  ```

## Database

- Run migrations:
  ```bash
  make db-migrate
  ```

- Upsert seeds:
  ```bash
  make db-seed
  ```

- Access database through terminal:
  ```bash
  make db-shell
  ```
  - Insert password and run `use <db_name>;` to enter the database and run sql queries.

## Staging

- Run API on production mode:
  ```bash
  make deploy-stg
  ```
  - Make sure you are on `staging` branch.
  - Make sure the `.env` file has the staging environment values.

- See running API logs:
  ```bash
  make logs
  ```

- Create a bash terminal inside the API container:
  ```bash
  make shell
  ```

## Production

- Run API on production mode:
  ```bash
  make deploy-prod
  ```
  - Make sure you are on `master` branch.
  - Make sure the `.env` file has the production environment values.

- See running API logs:
  ```bash
  make logs
  ```

- Create a bash terminal inside the API container:
  ```bash
  make shell
  ```

## License

Nest is [MIT licensed](LICENSE).
