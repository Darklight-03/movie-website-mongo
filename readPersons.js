
print("Creating persons collection...");


// much slower method that works
var moviesCursor = db.movies.find( { "credits": { $ne: null } } ).noCursorTimeout();
var numMovies = db.movies.count();
var moviesIterated = 0;

db.persons.createIndex( { "id": 1 } );


moviesCursor.forEach( function (currentMovie) {
	var i;
	var castItem;
	var crewItem;
	//print("sz=" + currentMovie.credits.cast.length);
	for (i = 0; i < currentMovie.credits.cast.length; i++) {
		//print(currentMovie.credits.cast[i].name);
		castItem = currentMovie.credits.cast[i];
		db.persons.updateOne(
			{ "id": {$eq: castItem.id } },
			{ $set: { "name": castItem.name,
			         "gender": castItem.gender,
					 "profile_path": castItem.profile_path,
					 "is_cast": 1 },
			  $addToSet: { "movies": currentMovie._id }
			},
			{ upsert: 1 }
		);
	}
	for (i = 0; i < currentMovie.credits.crew.length; i++) {
		//print(currentMovie.credits.cast[i].name);
		crewItem = currentMovie.credits.crew[i];
		db.persons.updateOne(
			{ "id": {$eq: crewItem.id } },
			{ $set: { "name": crewItem.name,
			         "gender": crewItem.gender,
					 "profile_path": crewItem.profile_path,
					 "is_crew": 1 },
			  $addToSet: { "movies": currentMovie._id }
			},
			{ upsert: 1 }
		);
	}
	if ((moviesIterated % 10000) == 0) {
		print("Progress: ~" + (100 * (moviesIterated/numMovies)).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0] + "%.  " + moviesIterated + "/" + numMovies + " movies");
	}
	if ((moviesIterated % 1000) == 0) {
		db.persons.reIndex();
	}
	moviesIterated += 1;
});
moviesCursor.close();

db.persons.update(
	{ "is_cast": { $exists: 0 } },
	{ $set: { "is_cast": 0 } }
);
db.persons.update(
	{ "is_crew": { $exists: 0 } },
	{ $set: { "is_crew": 0 } }
);

print("Done creating persons collection.");