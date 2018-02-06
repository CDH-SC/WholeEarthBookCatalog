***DHC***

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
  + .NET core
  + MongoDB
  + Neo4j

To make our lives and the lives of those who wish to run this software easier, we have chosen to deploy our app inside [Docker](https://docs.docker.com/) containers.

***Install Docker:***

  + [Mac](https://docs.docker.com/docker-for-mac/install/)
  + [Ubuntu](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/)
  + [Windows](https://docs.docker.com/docker-for-windows/install/)

<h1> Building </h1>

You need a configuration file which defines the port the webapp will be served on, as well as the neo4j password.  
We have provided an example file to model what this should look like.

Before deployment, be sure to edit the `app.conf.example` and rename as `app.conf`. The password for neo4j can be set to whichever value you please, and we're using the port `8080`, but any open port should do.

***Run:***

```
$ source app.conf
$ docker-compose up
```

The app will be deployed on `localhost:$SERVER_PORT`.

***Notes:***

  + The above example assumes you are running `bash`. If you have a different shell, it might not use the `source` command to handle environment variables.
  + You can change the second command to `docker-compose up -d` so that docker runs the processes in the background.
  + Check on the status of your containers with `docker logs <container_id>`. The id can be found by running `docker ps`.

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
  If you run into any issues with the polymer-cli email me at vmcqiunn@email.sc.edu
  
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

