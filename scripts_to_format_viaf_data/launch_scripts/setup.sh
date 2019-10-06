#!/bin/bash
sudo apt-get install -y software-properties-common 
sudo add-apt-repository ppa:deadsnakes/ppa -y 
sudo apt-get update
sudo apt-get install python3.7 python3.7-dev
sudo apt-get install liblz4-tool -y

wget https://bootstrap.pypa.io/get-pip.py -O get-pip.py
python3.7 get-pip.py --user
pip3.7 install --user cityhash lxml
rm get-pip.py
