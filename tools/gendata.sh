#!/bin/bash
python3 xmltojson.py -i dr59.xml -o full.json && python3 jsontocsv.py -i full.json -o full.csv
# python3 xmltojson.py -i 5000.xml -o 5000.json && python3 jsontocsv.py -i 5000.json -o 5000.csv
