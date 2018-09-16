// inserts credits objects into the matching movie document



print("Inserting credits into movie documents...");

db.movies.aggregate(
    [
		//{ "$match": { "hasCredits": 1 } }	
        { "$addFields": { "credits": db.credits.findOne( { "id" : "$id" } ) } },
		{ "$addFields": { "creditslookup": { $concat: [ "$id", "" ] } } },
        { "$out": "movies" }
    ]
);

// var moviesCursor = db.movies.find( { "hasCredits" : 1 } );
// var num_id;

// credit_ids.insertMany(db.credits.distinct( "_id" ));

// moviesCursor.forEach( function (currentMovie) {
	// num_id = currentMovie.id
	// db.movies.updateOne(
		// { "id" : num_id },
		// { $set:
			// { "credits" :
				// db.credits.findOne( { "id" : num_id.toString() } )
			// }
		// }
	// );
	
	// db.credits.remove({});
// })

print("Done.");

// moviesCursor.close();

