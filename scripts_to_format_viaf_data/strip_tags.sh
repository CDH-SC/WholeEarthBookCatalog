sed -i '0,/<clusters>/{s/<clusters>//}' viaf.xml
sed -i '$s/<\/clusters>//' viaf.xml
