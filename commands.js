// This file is for storing all of the commands to save javascript functions to
// the server.

// getRecordByMovieId
db.system.js.save(
  {
    _id: "getRecordByMovieId",
    value: function(x) {
      return db.movies.find({
        id: {$eq: x}
      });
    }
  }
)

// getRecordByIMDBId
db.system.js.save({
  _id: "getRecordByIMDBId",
  value: function(x) {
    return db.movies.find({
      imdb_id: {$eq: x}
    });
  }
})

// getMovieStats
db.system.js.save(
  {
    _id: "getMovieStats",
    value: function(x) {
      count = db.runCommand({ count: "movies" });
      count = count.n
      total_runtime = db.movies.aggregate([
        {
          $group: {_id: null, total: {$sum: "$runtime"}}
        }
      ]);
      total_runtime = total_runtime.toArray()[0].total;
      hours = total_runtime/60;
      minutes = total_runtime%60;
      ugenres = db.movies.distinct( "genres" ).filter(genre=>genre.id!=null).length;
      
      return `Movies: ${count}\nTotal Running Time: ${Math.floor(hours)}:${minutes}\nUnique Genres: ${ugenres}`;
    }
  }
)

// getAggregateRecordByMovieId
// since we merged credits into movies, just needs to call getRecordByMovieId
db.system.js.save(
  {
    _id: "getAggregateRecordByMovieId",
    value: function(x) {
      return getRecordByMovieId(x);
    }
  }
)


// getPersonById
// returns person object with field "movies" which is an array containing all of the movie documents normally only referenced by objectID
db.system.js.save(
  {
    _id: "getPersonById",
    value: function(x) {
      var person = db.persons.findOne( { id: {$eq: x} } );
      var movies = db.movies.find( { "_id": { $in: person.movies } } ).toArray();
      person.movies = movies;
      return person;
    }
  }
)