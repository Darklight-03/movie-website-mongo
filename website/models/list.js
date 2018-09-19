//Require mongoose package
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Define Schema with title, description and category
const moviesSchema = new Schema({
  original_title: String,
  id: Number,
});

const movies = module.exports = mongoose.model('movies', moviesSchema );
module.exports.getMovie = (info,callback) => {
  movies.find({id: info.query.id}, callback);
}
