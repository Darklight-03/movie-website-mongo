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

// getCastByMovieID
db.system.js.save(
  {
    _id: "getCastByMovieID",
    value: function(x) {
      y = db.movies.find(
        {id: {$eq: x}},
        {credits:1}
      );

      return y.cursor.firstBatch[0].credits.cast;
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

      total_runtime = db.movies.aggregate([
        {
          $group: {_id: null, total: {$sum: "$runtime"}}
        }
      ]);

      total_runtime = total_runtime.toArray()[0].total;
      hours = total_runtime/60;
      minutes = total_runtime%60;
      ugenres = db.movies.distinct( "genres" )

      ugenres.filter(genre=>genre.id!=null).length;
      
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


