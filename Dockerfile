FROM node:18.3.0-slim

EXPOSE 8080

WORKDIR /home/node

# RUN apt-get update && \
#   apt-get dist-upgrade --yes && \
#   apt-get install --yes wget && \
#   apt-get install --yes python && \
#   apt-get install --yes build-essential && \
#   apt-get autoremove --yes

USER node

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY ./out .

CMD ["node", "./bin/serve" ]
