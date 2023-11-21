# Description

Rest API do projeto Super Monitoria desenvolvido no IComp com o apoio do SUPER.

# Prerequisites

Make sure you have the following dependencies installed:
- Docker
- docker-compose

  [Installation Tutorial For Super Monitoria](https://drive.google.com/file/d/1VTI1zlTJT60XxN5O1b0aDQJpFyklRkdr/view?usp=sharing)


## :tada: How to run

```bash
# Clone this repo
$ git clone https://github.com/ajuda-ai-ufam/backend.git

# change to project directory
$ cd backend

# Create a .env file with the envs on .example.env.
$ Obtain project development .env files from someone on the current team or Tech Lead

# Run the MakeFile to up the backend and MySql database
$ make up

# Open another terminal and run the MakeFile to pull database migrations
$ make db-migrate

# On the same terminal run the MakeFile to populate the database with the seeds
$ make db-seed

# On the same terminal run the MakeFile to populate the database with the mocks
$ make db-populate

# Ready! your backend is running on http://localhost:3003 
```

# Scripts

We use Makefile commands to run our scripts:

## Development

### Steps

1 step - Build docker images with command:


- Run database and API on watch mode:
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
