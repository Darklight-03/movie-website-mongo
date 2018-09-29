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
const searchSchema = new Schema({
  name: String,
  type: String,
  popularity: Number,
  item: {type: Schema.Types.ObjectId, refPath: 'type'}
});

const movies = module.exports = mongoose.model('movies', moviesSchema );
const persons = module.exports = mongoose.model('persons', personsSchema );

function findAtId(id,arr){
  var x = -1;
  arr.forEach((ele,i)=>{
    if(parseInt(ele._id.id) == parseInt(id)){
      x = i;
    }
  });
  return x;
}

// returns the entire movie object from database
module.exports.getMovie = (info,callback) => {
  // info.query gets the object containing arguments passed from request.
  movies.findOne({id: info.query.id}, callback);
}

// returns the entire person object from database
module.exports.getPerson = (info,callback) => {
  persons.findOne({id: info.query.id}).populate('cast_movies._id','title poster_path id').populate('crew_movies._id','title poster_path id').then((p)=>{
    var arr = [];
    var arr1 = [];
    var arr2 = [];
    p.cast_movies.slice(0).forEach((movie,i)=>{
      if(!arr.includes(movie._id.id)){
        arr.push(movie._id.id);
      }else{
        arr1.push(movie._id.id);
        arr2.push(movie.character);
        p.cast_movies[i]=null;
      }
    });
    p.cast_movies = p.cast_movies.filter((movie)=>{
      if(movie==null){
        return false;
      }
      else return true;
    });
    arr1.forEach((id,i)=>{
      var character = arr2[i];
      p.cast_movies[findAtId(id,p.cast_movies)].character += ", "+character;
    });

    arr = [];
    arr1 = [];
    arr2 = [];
    p.crew_movies.slice(0).forEach((movie,i)=>{
      if(!arr.includes(movie._id.id)){
        arr.push(movie._id.id);
      }else{
        arr1.push(movie._id.id);
        arr2.push(movie.department);
        p.crew_movies[i]=null;
      }
    });
    p.crew_movies = p.crew_movies.filter((movie)=>{
      if(movie==null){
        return false;
      }
      else return true;
    });
    arr1.forEach((id,i)=>{
      var department = arr2[i];
      p.crew_movies[findAtId(id,p.crew_movies)].department += ", "+department;
    });
    
    
    callback(false,p);
  });
}

module.exports.getTopGrossing = (info,callback) => {
  movies.find({},null,{limit:10,sort:{revenue: -1}},callback);
}

module.exports.getPopularPeople = (info,callback)=>{
  persons.find({},null,{limit:10,sort:{popularity: -1}},callback);
}

module.exports.autocomplete = (info,callback)=>{
  var updatedinfo = info;
  info.query.num = 5;
  info.query.fullq = `(^| )${info.query.q}.*`;
  return module.exports.search(info,callback);
}

// returns {movies: arr, people: arr}
module.exports.search = (info,callback) => {
  var query = info.query.fullq || `(^| )(${info.query.q}( |$)`;
  var sortfield = info.query.sortfield || 'popularity';
  var limit = parseInt(info.query.num) || 100;
  var start_from = parseInt(info.query.start) || 0;
  // run find operations for titles or names containing the query
  
  search.find({name: {$regex: query, $options: 'i'}}).populate('item', 'id title name poster_path profile_path cast_movies crew_movies').sort({sortfield: -1}).limit(limit).skip(start_from).then((results)=>{
    var finalresults = results.map((result) => {
      if(result.type == movie){
        var ret = {id: result.item.id, name: result.item.title, image: result.item.poster_path};
        return ret;
      }else{
        var ret = {id: result.item.id, name: result.item.name, image: result.item.profile_path, roles: {characters: result.item.cast_movies, departments: result.item.crew_movies}};
        return ret;
      }
      callback(false,finalresults);
    });
  }).catch((err)=>{callback(err,null);});
}
