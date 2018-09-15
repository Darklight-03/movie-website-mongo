var moviesCursor = db.movies.find( { "hasCredits" : 1 } );


moviesCursor.forEach( function (doc) {
	var movieid = doc.id;
	print(movieid);
	print(db.credits.find( { "id" : movieid } ));
	doc.credits = db.credits.find( { "id" : movieid } );
})

moviesCursor.close();