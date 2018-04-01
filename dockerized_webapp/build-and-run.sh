# build file to set up and build the project. Make sure you have
# the correct permissions set.
#
# copy the utils to all the containers the need to use them
# this way we don't need to maintain separate instances of utils

cp -r utils app/
cp -r utils worldcat_data_acquisition/
cp -r utils loc_data_acquisition/

source app.conf
docker-compose build --no-cache
docker-compose up -d
