#!/bin/bash
vals=( 30k 3mil full )
for i in "${vals[@]}"
do
	python3 viaf-xml-to-tsv.py -i /backup/data/viaf_data/uncompressed/viaf-${i}.xml -o /backup/data/viaf_data/uncompressed/viaf-${i}.tsv -s /backup/data/viaf_data/uncompressed/viaf-${i}-split
	tar zcvf /backup/data/viaf_data/compressed/viaf-${i}-split.tar.gz /backup/data/viaf_data/uncompressed/viaf-${i}-split
	gzip -k /backup/data/viaf_data/uncompressed/viaf-${i}.tsv
	mv /backup/data/viaf_data/uncompressed/viaf-${i}.tsv.gz /backup/data/viaf_data/compressed
done
