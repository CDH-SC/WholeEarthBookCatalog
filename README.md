# DHC

## Setup  

If you have not already, clone the repo to get the source code. 

```
git clone https://github.com/SCCapstone/DirtyHistoryCrawler.git
```
  
Enter the `dockerized_webapp` directory.
```
cd dockerized_webapp
```  

## Dependencies  

This app uses:

  + Node.js
  + Polymer.js
  + MongoDB
  + Neo4j

To make our lives and the lives of those who wish to run this software easier, we have chosen to deploy our app inside [Docker](https://docs.docker.com/) containers, but, it is still best to run in a linux environment.

***Install Docker:***

  + [Mac](https://docs.docker.com/docker-for-mac/install/)
  + [Ubuntu](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/)
  + [Windows](https://docs.docker.com/docker-for-windows/install/)

## Building  

You need a configuration file which defines the port the webapp will be served on. We have provided an example file to model what this should look like.

Before deployment, be sure to edit the `.env.example` and rename as `.env`. _The naming convention is very important. You MUST name this file `.env` or `docker-compose` will not recognize it._  

***Data Acquisition:***

If you want to run the worldcat miner, you need a [wskey](https://www.oclc.org/developer/develop/authentication/what-is-a-wskey.en.html) from worldcat. Once you have one, set the `WSKEY` environment variable in your `.env` file.

***Production Versus Development Builds:***

In the `dockerized_webapp` directory there are two different `.yml` files to configure `docker-compose` builds. `docker-compose.yml` is the configuration file for production builds and is the default configuration file. The main difference between this and the `docker-compose.dev.yml` file is that the former has more memory allocated to neo4j and is configured to restart containers if they exit with a non-zero code. Also, the dev configuration has opened ports for the neo4j web browser, which is convenient for doing development, but insecure for public facing production deployments.  

To build the production version of the app:  
```
$ docker-compose build
```

To build the development version of the app:
```
$ docker-compose -f docker-compose.dev.yml build
```  

## Deploying

for production:  
```
$ docker-compose up -d
```

for development:
```
$ docker-compose -f docker-compose.dev.yml -d
```

The app will be deployed on `localhost:$SERVER_PORT`.

***Notes:***
  + If you want, you can skip the `build` command and just run `up`. Compose will automatically run the build step. However, sometimes you may want to separate them out to tweak the build process; e.g. running `docker-compose build --no-cache` to ensure that the build is completely fresh when your source code is altered.
  + You can check on the status of your containers with `docker logs <container_id>`. The id can be found by running `docker ps`.
  + If you specified the `docker-compose.dev.yml` config file to run a development build, you must also sepcify this file if you want to stop the deployment: `docker-compose -f docker-compose.dev.yml down`.  
  
## Testing  

***For Behvaioral Tests:***

  Tests must be ran locally.  
  
  cd into ```dockerized_webapp\public\```  
  Ensure _npm and bower_ are installed globally. Then, install polymer and the needed bower components using:  
  ```
  $ npm install -g polymer-cli
  $ bower install
  ```
  
  Finally, run the test:  
  `$ polymer test`  
  
  `polymer test` only logs if a test fails by default, to show a log for each test ran use: 
  
  `$ polymer test --expanded`
  
  You may need to use `sudo` before each command if you run into permission issues.
  If you run into any issues with the polymer-cli email me at vmcquinn@email.sc.edu
  
  Currently, we don't have a browser set up with docker to run the tests with selenium hence testing locally.
  
  ***For Unit Tests:***  
  Install mocha globally with:  
  `$ npm -g mocha` 
  Then run:   
  `$ mocha`

## Potential Problems  

If you have MongoDB installed locally on your machine, it may be running in the background. If so, it is likely running on the port that the dockerized instance of MongoDB from this app is intended to run on. If you run into this problem, there are two quick fixes:

  + You can stop your local mongo instance. I do this on ubuntu with `systemctl stop mongod`.
  + You can go into the `docker-compose.yml` file and change the port mapping for mongo to a different port.

