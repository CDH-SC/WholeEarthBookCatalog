cd ./LOCFiles
find . -name '*.xml.gz' -exec gzip -d {} \;
for f in *.xml; do mv "$f" "${f#BooksAll.2014.part}"; done
cd ../
