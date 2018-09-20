//Require mongoose package
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Define Schemsas
const moviesSchema = new Schema({
  title: String,
  id: Number,
  poster_path: String
});
const personsSchema = new Schema({
  name: String,
  id: Number,
  profile_path: String,
  cast_movies: Array,
  crew_movies: Array
});

const movies = module.exports = mongoose.model('movies', moviesSchema );
const persons = module.exports = mongoose.model('persons', personsSchema );

// returns the entire movie object from database
module.exports.getMovie = (info,callback) => {
  // info.query gets the object containing arguments passed from request.
  movies.findOne({id: info.query.id}, callback);
}

// returns the entire person object from database
module.exports.getPerson = (info,callback) => {
  persons.findOne({id: info.query.id}, callback);
}

// returns {movies: arr, people: arr}
module.exports.search = (info,callback) => {
  // run find operations for titles or names containing the query
  movies.find({title: {$regex: `.*${info.query.q}.*`, $options: 'i'}}, 'id title poster_path').then((movievalue)=>{
    persons.find({name: {$regex: `.*${info.query.q}.*`, $options: 'i'}}, 'id name profile_path cast_movies crew_movies',(err, lists) => {

      // re-make the movies object to have same fields as person object.
      retmovies = movievalue.map((movie)=>{
        var mov = {id: movie.id, name: movie.title, image: movie.poster_path};
        return mov;
      });
      if(err){
        callback(err,{movies: retmovies});
      }else{
        
        // same thing for the people object.
        retpeople = lists.map((person)=>{
          var persn = {id: person.id, name: person.name, image: person.profile_path, roles: {characters: person.cast_movies, departments: person.crew_movies}}
          return persn;
        });

        // return both object arrays in the object returned.
        callback(err,{movies: retmovies, people: retpeople})
      }
    });
  }).catch((err)=>{
    callback(err,null);
  });
}