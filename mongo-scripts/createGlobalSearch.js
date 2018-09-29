// creates a collection that combines movies and people
// helps when searching and you want to sort by popularity, title, etc


print('Creating global_search collection...');

var moviesCursor = db.movies.find();
var personsCursor = db.persons.find();
var iterated = 0;
var num = db.movies.count() + db.persons.count();

// if it already exists we aren't upserting so just replace it compleatly.
db.global_search.drop();
db.createCollection('global_search');

moviesCursor.forEach( function (currentMovie) {
  db.global_search.insert({ 'name': currentMovie.title, 'popularity': currentMovie.popularity, 'type': 'movies', 'item': currentMovie._id });
  iterated++;
  if ((iterated % 30000) == 0) {
		print('Progress: ~' + (100 * (iterated/num)).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0] + '%.  ' + iterated + '/' + num + ' items');
	}
});

personsCursor.forEach( function (currentPerson) {
  db.global_search.insert({ 'name': currentPerson.name, 'popularity': currentPerson.popularity, 'type': 'persons', 'item': currentPerson._id });
  iterated++;
  if ((iterated % 30000) == 0) {
		print('Progress: ~' + (100 * (iterated/num)).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0] + '%.  ' + iterated + '/' + num + ' items');
	}
});

db.global_search.createIndexes([ { 'name': 1 }, { 'popularity': 1}, { 'item': 1 } ]);

print('Done creating global_search collection...');
