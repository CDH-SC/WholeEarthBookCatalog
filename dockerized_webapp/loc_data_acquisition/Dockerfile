FROM jbdrain/polymer-cli:latest

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install

COPY . .


ENTRYPOINT exec ./data.sh
