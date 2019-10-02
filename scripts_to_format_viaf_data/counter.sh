#!/bin/bash
vals=( coAuthor pub titles countries isbns)
for i in "${vals[@]}"
do
	echo "----${i} Count----" >> counts
	cut -f2 ${i}Table.tsv | sort | uniq | wc -l >> counts
done
vals2=( aliases )
for i in "${vals2[@]}"
do
	echo "----${i} Count----" >> counts
	cut -f1 ${i}Table.tsv | sort | wc -l >> counts
done

echo "----person Count----" >> counts
cut -f1 personTable.tsv | sort | uniq | wc -l >> counts
