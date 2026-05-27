FROM node:18-alpine

WORKDIR /app

COPY server/package.json ./server/

RUN cd server && npm install && npm install -g nodemon

COPY . .

EXPOSE 55555

WORKDIR /app/server

CMD ["sh", "-c", "npm install && nodemon server.js"]
