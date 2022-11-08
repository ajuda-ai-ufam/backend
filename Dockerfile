FROM node:alpine

WORKDIR  /app-test

ADD . .

RUN npm install

CMD ["npx","prisma","generate"]

CMD ["npx","prisma","db","seed"]

EXPOSE 443

CMD ["npm","start"]
