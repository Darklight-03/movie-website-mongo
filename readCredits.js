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

// create credits_id's collection
db.credits_ids.insertMany(db.credits.distinct( "_id" ));

db.credits.createIndex( { "id": 1 } );
db.movies.createIndex( { "id": 1 } );

// much slower method that works
var moviesCursor = db.movies.find( { "hasCredits" : 1 } );
var numMovies = db.movies.count();
var moviesIterated = 0;
moviesCursor.forEach( function (currentMovie) {
	// adds credits into movie document
	db.movies.updateOne(
		{ "id" : currentMovie.id },
		{ $set:
			{ "credits" :
				db.credits.findOne( { "id" : currentMovie.id.toString() } )
			}
		}
	);
	
	// removes credits from collection
	db.credits.remove( { "id" : currentMovie.id.toString() }, 1);
	
	// progress message
	if ((moviesIterated % 10000) == 0) {
		print("Progress: ~" + (100 * (moviesIterated/numMovies)).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0] + "%");
	}
	moviesIterated += 1;
});
moviesCursor.close();
// drop unnecessary collection
db.credits.drop();

// not sure yet if these do much
db.movies.reIndex();
db.credits_ids.createIndex( { "_id": 1 } );

print("Done inserting credits into movies.");

