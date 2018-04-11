***DHC***

<h1> Searching </h1>

Since there is not a wide swath of data in the database currently, I would recommend searching for something like "Harry Potter", or "Tolkien."

<h1> Setup </h1>

If you have not already, clone the repo to get the source code. 

```
git clone https://github.com/SCCapstone/DirtyHistoryCrawler.git
```
  
Enter the `dockerized_webapp` directory.
```
cd dockerized_webapp
```  

<h1> Dependencies </h1>

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

<h1> Building </h1>

You need a configuration file which defines the port the webapp will be served on, as well as the neo4j password.  
We have provided an example file to model what this should look like.

Before deployment, be sure to edit the `.env.example` and rename as `.env`. _The naming convention is very important. You MUST name this file `.env` or `docker-compose` will not recognize it._ The password for neo4j can be set to whichever value you please.

***Data Acquisition:***

If you want to run the worldcat miner, you need a [wskey](https://www.oclc.org/developer/develop/authentication/what-is-a-wskey.en.html) from worldcat. Once you have one, set the `WSKEY` environment variable in `app.conf`.

***Building:***

```
$ docker-compose build
```

***Running:***

```
$ docker-compose up -d
```

The app will be deployed on `localhost:$SERVER_PORT`.

***Notes:***

  + The above example assumes you are running `bash`. If you have a different shell, it might not use the `source` command to handle environment variables.
  + Check on the status of your containers with `docker logs <container_id>`. The id can be found by running `docker ps`.

***Development:***

If you do not wish to build the whole project to test your code, there is an included `start-dev.sh` script. This will work best if you have already built the project with `docker-compose`, as it uses the docker volumes created in that process. You must also write a small configuration file, as detailed in the comments of the script.  

If you are doing dev with the polymer code:  

```
$ cd public  
$ polymer build  
$ cd .. 
```

To run:  
  
``` 
$ ./start-dev.sh
```

<h1>Testing</h1>

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

<h1>Potential Problems</h1>

If you have MongoDB installed locally on your machine, it may be running in the background. If so, it is likely running on the port that the dockerized instance of MongoDB from this app is intended to run on. If you run into this problem, there are two quick fixes:

  + You can stop your local mongo instance. I do this on ubuntu with `systemctl stop mongod`.
  + You can go into the `docker-compose.yml` file and change the port mapping for mongo to a different port.

