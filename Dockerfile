FROM node:alpine

WORKDIR /WidgetApp

COPY package*.json .

RUN npm install

COPY . .

ENV BOT_TOKEN=
ENV BOT_ID=
ENV OAUTH_URL=
ENV PROXY_URL=

RUN npm run build

CMD [ "npm", "start" ]