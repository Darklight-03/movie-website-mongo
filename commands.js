




// getMovieStats
db.system.js.save(
  {
    _id: "getMovieStats",
    value: function(x) {
      count = db.runCommand({ count: "movies" })
      total_runtime = db.movies.group(
        key: {runtime: 1},
        initial: {total: 0},
        $reduce: function(curr,result){
          result.total += curr.runtime;
        }
      )
      return total_runtime
    }
  }
)
      
