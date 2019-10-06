for i in `seq 0 3`
do
	scp setup.sh node${i}:~/
#	ssh node${i} '~/setup.sh'
done
