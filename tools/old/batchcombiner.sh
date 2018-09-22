echo -n "[" >> combinedbatch.json;
for i in `seq 0 117`;
do
	cat batch$i.json | cut -d '[' -f2- | rev | cut -d ']' -f2- | rev >> combinedbatch.json 
	if [ "$i" != "117" ] 
	then
		echo -n ',' >> combinedbatch.json
	fi
	
done
sed -i '$ s/$/]/' combinedbatch.json; 
	
