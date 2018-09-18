password=`cat rwuser-passwd`

mongo movies_mongo -u rwuser -p $password --eval 'db.movies.drop()'
mongo movies_mongo -u rwuser -p $password --eval 'db.credits.drop()'
mongo movies_mongo -u rwuser -p $password --eval 'db.credits_ids.drop()'
mongo movies_mongo -u rwuser -p $password --eval 'db.persons.drop()'
/bin/bash populatedb.sh
