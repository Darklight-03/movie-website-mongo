//Require mongoose package
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Define Schema with title, description and category
const moviesSchema = new Schema({
  title: String,
  id: Number
});
const personsSchema = new Schema({
  name: String,
  id: Number
});

const movies = module.exports = mongoose.model('movies', moviesSchema );
const persons = module.exports = mongoose.model('persons', personsSchema );

module.exports.getMovie = (info,callback) => {
  movies.findOne({id: info.query.id}, callback);
}

module.exports.search = (info,callback) => {
  movies.find({title: info.query.q}, (err, lists) => {
        
  }).then((movievalue)=>{
    persons.find({name: info.query.q}, (err, lists) => {
      if(err){
        callback(err,{movies: movievalue});
      }else{
        callback(err,{movies:movievalue,people:lists})
      }
    });
 
  }).catch((err)=>{
    callback(err,null);
  });
  }
