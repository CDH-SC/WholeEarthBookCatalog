#!/bin/bash
# Script that pushes setup script out to nodes
# TODO Figure out headless sudo
for i in `seq 0 3`
do
	scp setup.sh node${i}:~/
done
