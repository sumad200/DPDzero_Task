FROM node:18-alpine

WORKDIR /app

COPY package*.json .

RUN npm config set strict-ssl false

RUN npm ci

COPY . .

CMD [ "npm", "run", "start:migrate" ]
