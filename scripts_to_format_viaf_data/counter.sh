#!/bin/bash
vals=( coAuthor pub titles countries)
for i in "${vals[@]}"
do
	echo "----${i} Count----" >> counts
	cut -f2 ${i}Table.tsv | sort | uniq | wc -l >> counts
done
vals2=( aliases isbns person )
for i in "${vals2[@]}"
do
	echo "----${i} Count----" >> counts
	cut -f1 ${i}Table.tsv | sort | uniq | wc -l >> counts
done
