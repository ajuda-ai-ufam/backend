FROM node:alpine

WORKDIR  /app

ADD . .

RUN npm install

RUN npx prisma generate

EXPOSE 3002

# ARG UNAME=luiz

# ARG UID=1000

# ARG GID=1000

# RUN groupadd -g $GID -o $UNAME

# RUN useradd -m -u $UID -g $GID -o -s /bin/bash $UNAME

# USER $UNAME

CMD ["npm","start"]
