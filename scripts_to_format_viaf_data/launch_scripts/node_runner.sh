#!/bin/bash
cd ~/
lz4 ~/viaf-data.lz4 ~/viaf-data -df
cd code
python3.7 ~/code/viaf-xml-to-tsv.py -i ~/viaf-data -o ~/viaf-out.tsv -s ~/viaf-split-$1 
cd ~/
#tar cvf viaf-split.tar viaf-split 
#lz4 viaf-split.tar viaf-split.tar.lz4 -zf
# lz4 viaf-out.tsv viaf-out.tsv.lz4 -zf
rsync -avrz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" ~/viaf-split-$1 graphb:/backup/data/viaf_data/transfer
rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" ~/viaf-out.tsv graphb:/backup/data/viaf_data/transfer/viaf-out-$1.tsv
