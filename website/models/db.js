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
  cast_movies: [{_id: {type: Schema.Types.ObjectId, ref: 'movies'}, character: String}],
  crew_movies: [{_id: {type: Schema.Types.ObjectId, ref: 'movies'}, department: String}]
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

module.exports.getPopularMovies = (info,callback)=>{
  movies.find({},null,{limit:10,sort:{popularity: -1}},callback);
}

module.exports.autocomplete = (info,callback)=>{
  var updatedinfo = info;
  info.query.limit = 5;
  info.query.fullq = `(^| )${info.query.q}.*`;
  return module.exports.search(info,callback);
}

// returns {movies: arr, people: arr}
module.exports.search = (info,callback) => {
  var query = info.query.fullq || `.*${info.query.q}.*`;
  var sortfield = info.query.sortfield || 'popularity';
  var limit = parseInt(info.query.limit) || 100;
  // run find operations for titles or names containing the query
  movies.find({title: {$regex: query, $options: 'i'}}, 'id title poster_path').sort({sortfield: -1}).limit(limit).then((movievalue)=>{
    persons.find({name: {$regex: query, $options: 'i'}}, 'id name profile_path cast_movies crew_movies').sort({sortfield: -1}).limit(limit).then((lists) => {

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
