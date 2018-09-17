// This file is for storing all of the commands to save javascript functions to
// the server.

// getRecordByMovieId
db.system.js.save(
  {
    _id: "getRecordByMovieId",
    value: function(x) {
      y = db.movies.find({
        id: {$eq: x}
      })
      s = db.movies.find({
        id: {$eq: x}
      }).explain("executionStats")
      printjson(s);
      return y;
    }
  }
)

// getCastByMovieId
db.system.js.save(
  {
    _id: "getCastByMovieId",
    value: function(x) {
      y = db.movies.find({id: x},{credits:1})
      
      printjson(y.explain('executionStats'));

      return y.toArray()[0].credits.cast;
    }
  }
)

// getRecordByIMDBId
db.system.js.save({
  _id: "getRecordByIMDBId",
  value: function(x) {
    y = db.movies.find({
      imdb_id: {$eq: x}
    })  
    s = db.movies.find({
      imdb_id: {$eq: x}
    }).explain("executionStats");
    printjson(s);
    return y;
  }
})

// getMovieStats
db.system.js.save(
  {
    _id: "getMovieStats",
    value: function(x) {
      count = db.movies.count();
      scount = db.movies.explain("executionStats").count();
      printjson(scount);

      total_runtime = db.movies.aggregate([
        {
          $group: {_id: null, total: {$sum: "$runtime"}}
        }
      ]);
      sruntime = db.movies.explain("executionStats").aggregate([
        {
          $group: {_id: null, total: {$sum: "$runtime"}}
        }
      ]);
      printjson(sruntime);

      total_runtime = total_runtime.toArray()[0].total;
      hours = total_runtime/60;
      minutes = total_runtime%60;
      ugenres = db.movies.distinct( "genres" )
      sugenres = db.movies.explain("executionStats").distinct("genres")
      printjson(sugenres);

      ugenres = ugenres.filter(genre=>genre.id!=null).length;
      
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
      y = getRecordByMovieId(x);
      
      return y;
    }
  }
)

//getCreditsStats
db.system.js.save(
  {
    _id: "getCreditsStats",
    value: function(x) {
      count = db.credits_ids.count();
      scount = db.credits_ids.explain("executionStats").count();
      snumcast = db.persons.aggregate([ {$match: {is_cast: {$eq: 1}} },{$count: "cast"} ],{explain: true});
      numcast = db.persons.aggregate([ {$match: {is_cast: {$eq: 1}} },{$count: "cast"} ]).toArray()[0].cast;
      snumcrew = db.persons.aggregate([ {$match: {is_crew: {$eq: 1}} },{$count: "crew"} ],{explain: true});
      numcrew = db.persons.aggregate([ {$match: {is_crew: {$eq: 1}} },{$count: "crew"} ]).toArray()[0].crew;
      printjson(scount);
      printjson(snumcast);
      printjson(snumcrew);
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
