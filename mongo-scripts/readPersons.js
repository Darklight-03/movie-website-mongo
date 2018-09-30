// creates persons collection and fills based on movies (meant to be called AFTER readCredits)

print("Creating persons collection...");

// very slow method
var moviesCursor = db.movies.find( { "credits": { $ne: null } } ).noCursorTimeout();
var numMovies = db.movies.count();
var moviesIterated = 0;

// im not sure if indexing at this point does anything
db.persons.createIndex( { "id": 1 } );

moviesCursor.forEach( function (currentMovie) {
	var i;
	var castItem;
	var crewItem;
	// for each cast member
	for (i = 0; i < currentMovie.credits.cast.length; i++) {
		// upsert to persons
		castItem = currentMovie.credits.cast[i];
		db.persons.updateOne(
			{ "id": {$eq: castItem.id } },
			{ $set: { "name": castItem.name,
			         "gender": castItem.gender,
					 "profile_path": castItem.profile_path,
					 "is_cast": 1 },
			  $addToSet: { "cast_movies": { "_id": currentMovie._id, "character": castItem.character } } 
			},
			{ upsert: 1 }
		);
	}
	// for each crew member
	for (i = 0; i < currentMovie.credits.crew.length; i++) {
		// upsert to persons
		crewItem = currentMovie.credits.crew[i];
		db.persons.updateOne(
			{ "id": {$eq: crewItem.id } },
			{ $set: { "name": crewItem.name,
			         "gender": crewItem.gender,
					 "profile_path": crewItem.profile_path,
					 "is_crew": 1 },
			  $addToSet: { "crew_movies": { "_id": currentMovie._id, "department": crewItem.department } } 
			},
			{ upsert: 1 }
		);
	}
	// nice progress message with approximate percentage
	if ((moviesIterated % 10000) == 0) {
		print("Progress: ~" + (100 * (moviesIterated/numMovies)).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0] + "%.  " + moviesIterated + "/" + numMovies + " movies");
	}
	// re-index to increase speed (number might need adjustment but it still runs significantly faster than without)
	if ((moviesIterated % 1000) == 0) {
		db.persons.reIndex();
	}
	moviesIterated += 1;
});
moviesCursor.close();

// makes sure is_cast and is_crew fields will exist when checked for
db.persons.updateMany(
	{ "is_cast": { $exists: 0 } },
	{ $set: { "is_cast": 0 } }
);
db.persons.updateMany(
	{ "is_crew": { $exists: 0 } },
	{ $set: { "is_crew": 0 } }
);

print("Done creating persons collection.");
