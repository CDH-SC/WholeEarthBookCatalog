FROM node:boron

WORKDIR /usr/src/app
COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8080

ENTRYPOINT ["npm"]
CMD ["start"]
