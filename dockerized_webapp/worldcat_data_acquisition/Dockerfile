FROM node:boron

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install

COPY . .

ENTRYPOINT ["npm"]
CMD ["start"]
