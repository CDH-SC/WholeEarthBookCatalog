# This is a script for running a development version of the project.
#
# The `--mount` flag for running the database containers mounts the same
# volume these containers use with the docker-compose build of the project,
# so the data sets are consistent. The src and target should be the same on
# your system, if you have built the project, but if you are having issues 
# seeing the same data when running this script then double check.
#
# app-dev contains the environment variables: 
#   - NEO4J_PASSWORD
#   - NEO4J_URL
#   - MONGO_URL

source app-dev.conf
docker run -p 27017:27017 --mount src=dockerizedwebapp_data,target=/data/db -d mongo
docker run -p 7687:7687 -p 7474:7474 --mount src=dockerizedwebapp_neo4j,target=/var/lib/neo4j/data -d neo4j
node server
