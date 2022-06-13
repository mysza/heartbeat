FROM node:18.3.0-slim

ENV PORT 8080
ENV MONGO_URL mongodb://localhost:27017/ubio-heartbeat

EXPOSE ${PORT}

WORKDIR /home/node

USER node

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY ./out .

CMD ["node", "./bin/serve" ]
