FROM node:19.4-slim AS base
WORKDIR  /usr/src/app
COPY package*.json ./
RUN apt-get update && apt-get install -y openssl procps

FROM base as production
RUN npm ci --omit=dev
COPY . ./
RUN npx prisma generate
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3003


FROM base as staging
RUN npm ci --omit=dev
COPY . ./
RUN npx prisma generate
RUN npm run build
ENV NODE_ENV=staging
EXPOSE 8080


FROM base as development
RUN npm install
COPY . ./
RUN ls -la
RUN npx prisma generate
EXPOSE 3003
