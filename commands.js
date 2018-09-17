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

// getCastByMovieID
db.system.js.save(
  {
    _id: "getCastByMovieID",
    value: function(x) {
      x = db.runCommand({
        find: "movies",
        filter: { id: {$eq: x}},
        projection: {credits: 1}
      })
      return x.cursor.firstBatch[0].credits.cast;
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

//getCreditsStats
db.system.js.save(
  {
    _id: "getCreditsStats",
    value: function(x) {
      count = db.credits_ids.count();
      
      numcast = db.persons.aggregate([ 
        {
          $match: {is_cast: {$eq: 1}} 
        },
        {
          $count: "cast"
        } 
      ]).toArray()[0].cast;
      numcrew = db.persons.aggregate([ 
        {
          $match: {is_crew: {$eq: 1}} 
        },
        {
          $count: "crew"
        }
      ]).toArray()[0].crew;

      return `- Credits Entries: ${count}\n- Cast Members: ${numcast}\n- Crew Members: ${numcrew}`;
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
