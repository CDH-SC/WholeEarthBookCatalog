#!/bin/bash
# Script for running code on remote nodes
cd ~/

# Decompress LZ4 compressed XML files
# Use of LZ4 because original files take too long to transfer
lz4 ~/viaf-data.lz4 ~/viaf-data -df

cd code

# Process data split based on respective node number
python3.7 ~/code/viaf-xml-to-tsv.py -i ~/viaf-data -o ~/viaf-out.tsv -s ~/viaf-split-$1 
cd ~/

# Rsync results back to head node
rsync -avrz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" ~/viaf-split-$1 graphb:/backup/data/viaf_data/transfer
rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" ~/viaf-out.tsv graphb:/backup/data/viaf_data/transfer/viaf-out-$1.tsv
