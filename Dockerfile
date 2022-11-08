FROM node:alpine

WORKDIR  /app-dev

ADD . .

RUN npm install

CMD ["npx","prisma","generate"]

CMD ["npx","prisma","db","seed"]

EXPOSE 3001

CMD ["npm","start"]
