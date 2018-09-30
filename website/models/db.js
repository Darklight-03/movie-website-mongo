//Require mongoose package
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Define Schemsas
const moviesSchema = new Schema({
  title: String,
  id: Number,
  poster_path: String,
  revenue: Number,
  popularity: Number,
  year: Number,
  credits: {cast: [{name: String, character: String}], crew: [{name: String, department: String}]}
});
const personsSchema = new Schema({
  name: String,
  id: Number,
  profile_path: String,
  popularity: Number,
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
const global_search = module.exports = mongoose.model('global_search', searchSchema, 'global_search' );

function findAtId(id,arr){
  var x = -1;
  arr.forEach((ele,i)=>{
    if(parseInt(ele._id.id) == parseInt(id)){
      x = i;
    }
  });
  return x;
}

function sortfunc(field, order=1){
  return ((a,b)=>{
    var orderr = order;
    var r = 0;
    if(typeof(a["_id"]) != "undefined" && typeof(a["_id"]["_id"]) != "undefined"){
      if(a["_id"][field] < b["_id"][field]){
        r = -1;
      }
      if(a["_id"][field] > b["_id"][field]){
        r = 1
      }
    }else{
      if(a[field] < b[field]){
        r = -1;
      }
      if(a[field] > b[field]){
        r = 1
      }
    }
    return r*orderr;
  });
}

// returns the entire movie object from database
module.exports.getMovie = (info,callback) => {
  var sortfield = info.query.sort || "name";
  // info.query gets the object containing arguments passed from request.
  movies.findOne({id: info.query.id}).then((movie)=>{
    direction = 1;
    if(sortfield = "popularity"){
      direction = -1;
    }
    movie.credits.cast.sort(sortfunc(sortfield, direction)) 
    callback(null,movie);
  }).catch((err)=>{callback(err,null);});
}

// returns the entire person object from database
module.exports.getPerson = (info,callback) => {
  var sortField = info.query.sort || "popularity"
  persons.findOne({id: info.query.id}).populate('cast_movies._id','title poster_path id popularity year').populate('crew_movies._id','title poster_path id popularity year').then((p)=>{
    var arr = [];
    var arr1 = [];
    var arr2 = [];
    
    var direction = 1;
    if(sortField == "popularity" || sortField == "year"){
      direction = -1;
    }

    p.cast_movies = p.cast_movies.sort(sortfunc(sortField,direction));
    p.crew_movies = p.crew_movies.sort(sortfunc(sortField,direction));
    
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
  // get args
  var query = info.query.fullq || `(^| )(${info.query.q})( |$)`;
  var sortfield = info.query.sortfield || 'popularity';
  var limit = parseInt(info.query.num) || 100;
  var start_from = parseInt(info.query.start) || 0;
  // run find operations for titles or names containing the query
  console.log(limit);

  // sort reverse if popularity is the sort field
  var dir = 1;
  if(sortfield == "popularity"){
    dir *= -1;
  }

  global_search.find({name: {$regex: query, $options: 'i'}}).populate('item', 'id title name poster_path profile_path cast_movies crew_movies popularity').sort({[sortfield]: dir}).limit(limit).skip(start_from).then((results)=>{
    // after gettings results normalize movie and people fields.
    var finalresults = results.map((result) => {
      if(result.type == "movies"){
        var ret = {id: result.item.id, name: result.item.title, image: result.item.poster_path, popularity: result.popularity};
        return ret;
      }else{
        var ret = {id: result.item.id, name: result.item.name, image: result.item.profile_path, popularity: result.popularity, roles: {characters: result.item.cast_movies, departments: result.item.crew_movies}};
        return ret;
      }
    });
    callback(false,finalresults);
  }).catch((err)=>{callback(err,null);});
}
