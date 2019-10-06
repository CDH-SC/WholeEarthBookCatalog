#!/bin/bash
sudo rm -fr /backup/data/viaf_data/transfer/*
cd ../../
for i in `seq 0 3`
do
	rsync -arvz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" scripts_to_format_viaf_data/ node${i}:~/code
	rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" /backup/data/viaf_data/uncompressed/xml_split/viaf-0${i}.lz4 node${i}:~/viaf-data.lz4
	ssh node${i} "nohup ~/code/node_runner.sh ${i} >> errors.out 2>&1 &"

done
cd scripts_to_format_viaf_data
nohup python3 viaf-xml-to-tsv.py -i /backup/data/viaf_data/uncompressed/xml_split/viaf-04 -o /backup/data/viaf_data/transfer/viaf-out-4.tsv -s /backup/data/viaf_data/transfer/viaf-split-4 > errors.out &
nohup python3 join_results.py > errors.out &
