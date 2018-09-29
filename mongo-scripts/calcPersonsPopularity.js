print("Calculating popularity...");

db.movies.reIndex();

var personsCursor = db.persons.find( { "cast_movies": { $exists: 1 } } ).noCursorTimeout();
var numPersons = db.persons.count(  {"cast_movies":  { $exists: 1 } } );
var personsIterated = 0;


personsCursor.forEach( function (currPerson) {
	var totalPopularity = 0;
  var indvPop = 0;
	var numMovies = 0;

	for (i = 0; i < currPerson.cast_movies.length; i++) {
    numMovies++;
		indvPop = db.movies.findOne( { "_id": currPerson.cast_movies[i]._id }, { "popularity":1 } ).popularity;
    if (indvPop < (0.5 * (totalPopularity / numMovies))) {
      numMovies--;
      indvPop = 0;
    }
    totalPopularity += indvPop;
	}
	
  if (numMovies >= 15) {
    totalPopularity = totalPopularity / numMovies;
  }
  else {
    totalPopularity = (numMovies / 15) * (totalPopularity / numMovies);
  }
  totalPopularity *= 12;
	
	db.persons.updateOne( { "_id": currPerson._id }, { $set: { "popularity": totalPopularity } } );

	if ((personsIterated % 30000) == 0) {
		print("Progress: ~" + (100 * (personsIterated / numPersons)).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0] + "%.  " + personsIterated + "/" + numPersons + " people");
	}
	

	personsIterated += 1;
});


db.persons.updateMany(
	{ "popularity": { $exists: 0 } },
	{ $set: { "popularity": 0 } }
);


print("Done calculating popularity.");
