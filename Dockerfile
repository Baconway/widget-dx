FROM node:alpine

WORKDIR /WidgetApp

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", 'start' ]