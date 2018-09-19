//Require mongoose package
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Define BucketlistSchema with title, description and category
const moviesSchema = new Schema({
  original_title: String,
  id: String,
});

const movies = module.exports = mongoose.model('movies', moviesSchema );
module.exports.getAllLists = (callback) => {
  movies.findOne(callback);
}
