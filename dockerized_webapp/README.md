<h1> Setup </h1>

If you have not already, clone the repo to get the source code. 
```
git clone https://github.com/SCCapstone/DirtyHistoryCrawler.git
```
  
Enter this directory.
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

Before deployment, be sure to edit the `app.conf.example` file to include the correct info and rename as `app.conf`.

***Run:***

```
$ source app.conf
$ docker-compose up
```

The above example assumes you are running `bash`. If you have a different shell, it might not use the `source` command  
to handle environment variables.

<h1> Potential Problems </h1>

If you have MongoDB installed locally on your machine, it may be running in the background. If so, it is likely running on the port that   
the dockerized instance of MongoDB from this app is intended to run on. If you run into this problem, there are two quick fixes:

  + You can stop your local mongo instance. I do this on ubuntu with `systemctl stop mongod`.
  + You can go into the `docker-compose.yml` file and change the port mapping for mongo to a different port.
