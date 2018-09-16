
print("Creating persons collection...");


// much slower method that works
var moviesCursor = db.movies.find( { "credits": { $ne: null } } );
var numMovies = db.movies.count();
var moviesIterated = 0;

moviesCursor.forEach( function (currentMovie) {
	var i;
	//print("sz=" + currentMovie.credits.cast.length);
	for (i = 0; i < currentMovie.credits.cast.length; i++) {
		//print(currentMovie.credits.cast[i].name);
		db.persons.updateOne(
			{ "id": {$eq: currentMovie.credits.cast[i].id } },
			{ $set: { "name": currentMovie.credits.cast[i].name,
			         "gender": currentMovie.credits.cast[i].gender,
					 "profile_path": currentMovie.credits.cast[i].profile_path },
			  $addToSet: { "castMovies": currentMovie._id }
			},
			{ upsert: 1 }
		);
	}
	for (i = 0; i < currentMovie.credits.crew.length; i++) {
		//print(currentMovie.credits.cast[i].name);
		db.persons.updateOne(
			{ "id": {$eq: currentMovie.credits.crew[i].id } },
			{ $set: { "name": currentMovie.credits.crew[i].name,
			         "gender": currentMovie.credits.crew[i].gender,
					 "profile_path": currentMovie.credits.crew[i].profile_path },
			  $addToSet: { "crewMovies": currentMovie._id }
			},
			{ upsert: 1 }
		);
	}
	moviesIterated += 1;
	if (moviesIterated % 1000) {
		print("Progress: " + (100 * (moviesIterated/numMovies)) + "%");
	}
});
moviesCursor.close();

print("Done creating persons collection.");