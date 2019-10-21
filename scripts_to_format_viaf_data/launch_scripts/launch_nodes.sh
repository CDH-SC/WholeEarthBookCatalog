#!/bin/bash
# Script for pushing code out to multiple machines to speed up processing
# TODO Don't use sudo and actually fix permissions issues
sudo rm -fr /backup/data/viaf_data/transfer/*

cd ../../

# Transfer all the files and start them up
for i in `seq 0 3`
do
	rsync -arvz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" scripts_to_format_viaf_data/ node${i}:~/code
	rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" /backup/data/viaf_data/uncompressed/xml_split/viaf-0${i}.lz4 node${i}:~/viaf-data.lz4
	ssh node${i} "nohup ~/code/node_runner.sh ${i} >> errors.out 2>&1 &"

done

cd scripts_to_format_viaf_data
# Process portion of data locally
nohup python3 viaf-xml-to-tsv.py -i /backup/data/viaf_data/uncompressed/xml_split/viaf-04 -o /backup/data/viaf_data/transfer/viaf-out-4.tsv -s /backup/data/viaf_data/transfer/viaf-split-4 -c 13 --step 100 > errors.out &

# Run script in background that aggregates results
cd launch_scripts
nohup python3 join_results.py > errors.out &
