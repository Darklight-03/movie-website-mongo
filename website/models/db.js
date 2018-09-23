//Require mongoose package
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Define Schemsas
const moviesSchema = new Schema({
  title: String,
  id: Number,
  poster_path: String,
  revenue: Number
});
const personsSchema = new Schema({
  name: String,
  id: Number,
  profile_path: String,
  cast_movies: [{_id: {type: Schema.Types.ObjectId, ref: 'movies'}, character: String}],
  crew_movies: [{_id: {type: Schema.Types.ObjectId, ref: 'movies'}, department: String}]
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
  persons.findOne({id: info.query.id}, callback).populate('cast_movies._id','title poster_path id').populate('crew_movies._id','title poster_path id');
}

module.exports.getTopGrossing = (info,callback) => {
  movies.find({},null,{limit:10,sort:{revenue: -1}},callback);
}

module.exports.getPopularPeople = (info,callback)=>{
  persons.find({},null,{limit:10,sort:{popularity: -1}},callback);
}

// returns {movies: arr, people: arr}
module.exports.search = (info,callback) => {
  // run find operations for titles or names containing the query
  movies.find({title: {$regex: `.*${info.query.q}.*`, $options: 'i'}}, 'id title poster_path').sort({'popularity': -1}).limit(parseInt(info.query.limit)||100).then((movievalue)=>{
    persons.find({name: {$regex: `.*${info.query.q}.*`, $options: 'i'}}, 'id name profile_path cast_movies crew_movies').sort({'popularity': -1}).limit(parseInt(info.query.limit)||100).then((lists) => {

      // re-make the movies object to have same fields as person object.
      retmovies = movievalue.map((movie)=>{
        var mov = {id: movie.id, name: movie.title, image: movie.poster_path};
        return mov;
      });
        
        // same thing for the people object.
        retpeople = lists.map((person)=>{
          var persn = {id: person.id, name: person.name, image: person.profile_path, roles: {characters: person.cast_movies, departments: person.crew_movies}}
          return persn;
        });

        // return both object arrays in the object returned.
        callback(false,{movies: retmovies, people: retpeople})
    }).catch((err)=>{callback(err,null);});
  }).catch((err)=>{
    callback(err,null);
  });
}
