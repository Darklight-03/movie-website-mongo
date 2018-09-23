print("Calculating popularity...");

db.movies.reIndex();

var personsCursor = db.persons.find().noCursorTimeout();
var numPersons = db.persons.count();
var personsIterated = 0;


personsCursor.forEach( function (currPerson) {
	var totalPopularity = 0;
	var numMovies = 0;
	
	for (i = 0; i < currPerson.cast_movies; i++) {
		totalPopularity += db.movies.findOne( { "_id": currPerson.cast_movies[i]._id }, { "popularity":1 } ).popularity;
		numMovies++;
	}

	currPerson.popularity = (totalPopularity / numMovies);
}

