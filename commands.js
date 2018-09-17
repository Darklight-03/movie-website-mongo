// This file is for storing all of the commands to save javascript functions to
// the server.

// getRecordByMovieId
db.system.js.save(
  {
    _id: "getRecordByMovieId",
    value: function(x) {
      y = db.movies.find({
        id: {$eq: x}
      });
      printjson(y.explain("executionStats"));
      return y;
    }//no stats
  }
)

// getCastByMovieID
db.system.js.save(
  {
    _id: "getCastByMovieID",
    value: function(x) {
      y = db.runCommand({
        find: "movies",
        filter: { id: {$eq: y}},
        projection: {credits: 1}
      })
      printjson(y.explain("executionStats"));
      return y.cursor.firstBatch[0].credits.cast;
    }//no stats
  }
)

// getRecordByIMDBId
db.system.js.save({
  _id: "getRecordByIMDBId",
  value: function(x) {
        y = db.movies.find({
        imdb_id: {$eq: x}
        })
    printjson(bsoncxx::to_json(y.explain("executionStats"));
  
    return y;
  }//no stats
})

// getMovieStats
db.system.js.save(
  {
    _id: "getMovieStats",
    value: function(x) {
      count = db.runCommand({ count: "movies" });
      printjson(count.explain("executionStats").view());
      count = count.n
      total_runtime = db.movies.aggregate([
        {
          $group: {_id: null, total: {$sum: "$runtime"}}
        }
      ]);
      printjson(total_runtime.explain("executionStats"));
      total_runtime = total_runtime.toArray()[0].total;
      hours = total_runtime/60;
      minutes = total_runtime%60;
      ugenres = db.movies.distinct( "genres" )
      printjson(ugenres.explain("executionStats")
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
      printjson(y.explain("executionStats")
      return y;
    }
  }
)
