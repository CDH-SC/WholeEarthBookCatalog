Not really production ready yet...  

 Make sure to edit the app.conf.example file to include the correct info and rename as app.conf.

run:

```
$ source app.conf
$ docker-compose up
```

<h1> Notes on Docker </h1>

Remember that you need to expose whichever ports you want to use. You also need to map the ports on your local machine to the one in the container.

The Dockerfile is essentially for telling Docker how to set up the environment and run your app. In our case, we need to install node dependencies for each part of the app. We will also need to give commands to start both.

The initializing commands are given with `ENTRYPOINT` in the Dockerfile. We might find it easier to just write a shell script that performs all the commands we need.  


In zsh, I had to add double dollar signs in docker-compose.yml
to get the environment variables to go through. Singles worked
fine for me in bash.

Also, since our app will be one container, it should have one entry point that the front end is served on. Communication between the front end and the REST API should take place within the
container.
