#!/bin/bash
vals=( 30k 3mil full )
for i in "${vals[@]}"
do
	python3 viaf-xml-to-tsv.py -i /backup/viaf_data/uncompressed/viaf-${i}.xml -o /backup/viaf_data/uncompressed/viaf-${i}.tsv -s /backup/viaf_data/uncompressed/viaf-${i}-split
	tar zcvf /backup/viaf_data/compressed/viaf-${i}-split.tar.gz /backup/viaf_data/uncompressed/viaf-${i}-split
	gzip -k /backup/viaf_data/uncompressed/viaf-${i}.tsv
	mv /backup/viaf_data/uncompressed/viaf-${i}.tsv.gz /backup/viaf_data/compressed
done
