// inserts credits objects into the matching movie document

print("Inserting credits into movie documents...");

// a MUCH faster method that ALMOST works
// db.movies.aggregate([
	//{ "$match": { "hasCredits": 1 } }	
	// { "$addFields": { "creditslookup": { $toString:"$id" } } },
	// { "$addFields": { "credits": db.credits.findOne( { "id": {$toString:"$id"} } ) } },
	// { "$addFields": { "credits": db.credits.update({}, { $set: { "set": {$toString:"$id"} } } ) } },
	// { "$out": "movies" }
// ]);



// create credits id's collection
db.credits_ids.insertMany(db.credits.distinct( "_id" ));

// much slower method that works
var moviesCursor = db.movies.find( { "hasCredits" : 1 } );
moviesCursor.forEach( function (currentMovie) {
	db.movies.updateOne(
		{ "id" : currentMovie.id },
		{ $set:
			{ "credits" :
				db.credits.findOne( { "id" : currentMovie.id.toString() } )
			}
		}
	);
	
	db.credits.remove( { "id" : currentMovie.id.toString() }, 1);
});
moviesCursor.close();
db.credits.drop();

print("Done inserting credits into movies.");

