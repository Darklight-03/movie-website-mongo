
//db.movies.updateMany( { "hasCredits" : 1 }, { $set { "credits": db.credits.findOne( { "id" : ??? } ) } } );

var moviesCursor = db.movies.find( { "hasCredits" : 1 } );

moviesCursor.forEach( function (currentMovie) {
	print(currentMovie.hasCredits);
	if (db.credits.findOne( { "id" : currentMovie.id } ) != null) {
		db.movies.updateOne( { "_id" : currentMovie._id }, { $set: { "credits" : db.credits.findOne( { "id" : currentMovie.id } ) } } );
		print("Credits updated " + currentMovie.id);
	}
	else {
		print("No credits " + currentMovie.id);
	}
	
	// doesn't actually update anything
	//currentMovie.credits = ...;
})

moviesCursor.close();