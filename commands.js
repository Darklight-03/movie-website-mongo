// getRecordByIMDBId
db.system.js.save({
  _id: "getRecordByIMDBId",
  value: function(x) {
    return db.movies.find({
      imdb_id: {$eq: x}
    });
  }
})
