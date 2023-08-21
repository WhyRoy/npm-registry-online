FROM node:bookworm

USER root

RUN mkdir /app

WORKDIR /app

COPY package.json package-lock.json /app/

RUN cd /app && npm install

COPY . /app

RUN npx prisma generate

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
