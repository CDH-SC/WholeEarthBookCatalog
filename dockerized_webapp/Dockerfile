FROM node:boron

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install

RUN apt-get clean && apt-get update && apt-get install -y locales
RUN locale-gen en_US.UTF-8
ENV PYTHONIOENCODING UTF-8

COPY . .

RUN npm install --global bower

WORKDIR /usr/src/app/public

WORKDIR /usr/src/app

EXPOSE 8080

ENTRYPOINT ["npm"]
CMD ["start"]
