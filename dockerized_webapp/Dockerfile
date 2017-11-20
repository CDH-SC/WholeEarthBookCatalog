FROM node:boron

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm install --global bower

WORKDIR /usr/src/app/public

RUN bower install --allow-root

WORKDIR /usr/src/app

EXPOSE 8080

RUN polymer serve --port 8080

ENTRYPOINT ["npm"]
CMD ["start"]
