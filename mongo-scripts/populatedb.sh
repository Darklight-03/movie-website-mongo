password=`cat rwuser-passwd`

mongoimport --db movies_mongo --collection movies --mode upsert --username rwuser --password $password --file dataJSON/movies.json --jsonArray
mongoimport --db movies_mongo --collection credits --mode upsert --username rwuser --password $password --file dataJSON/credits.json --jsonArray
mongo movies_mongo -u rwuser -p $password readCredits.js
mongo movies_mongo -u rwuser -p $password readPersons.js
mongo movies_mongo -u rwuser -p $password calcPersonsPopularity.js
