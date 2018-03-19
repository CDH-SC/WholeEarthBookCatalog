FROM jbdrain/polymer-cli:latest

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install

COPY . .

WORKDIR /usr/src/app/public
RUN bower install --allow-root
RUN polymer build

WORKDIR /usr/src/app

EXPOSE 8080

ENTRYPOINT ["npm"]
CMD ["start"]
