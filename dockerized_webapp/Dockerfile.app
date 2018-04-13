FROM jbdrain/polymer-cli:latest

WORKDIR /usr/src/app
COPY ./app ./
COPY ./utils ./utils
RUN npm install

WORKDIR /usr/src/app/public
RUN bower install --allow-root
RUN polymer build

WORKDIR /usr/src/app

EXPOSE 8080

ENTRYPOINT ["npm"]
CMD ["start"]
