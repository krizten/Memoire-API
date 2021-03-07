FROM node:10-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
RUN npm install

COPY . ./

EXPOSE 8500
CMD [ "npm", "run", "start:prod" ]