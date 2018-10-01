//Require mongoose package
const mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var passport = require('passport');
mongoose.set('useCreateIndex', true);
var Schema = mongoose.Schema;

//Define Schemsas
const moviesSchema = new Schema({
  title: String,
  id: Number,
  poster_path: String,
  revenue: Number,
  popularity: Number,
  release_date: String,
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
const usersSchema = new Schema({
  id: { type: Number,
        index: { unique: true }
      },
  username: {
        type: String,
        index: { unique: true }
      },
  hash: String,
  salt: String,
  favorites: []
});
usersSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};
usersSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};
usersSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(expiry.getTime() / 1000),
  }, process.env.MOVEDB_AUTH_SECRET);
};

const movies = module.exports = mongoose.model('movies', moviesSchema );
const persons = module.exports = mongoose.model('persons', personsSchema );
const users = module.exports = mongoose.model('users', usersSchema );
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
  var sortfield2 = sortfield;
  // info.query gets the object containing arguments passed from request.
  movies.findOne({id: info.query.id}).then((movie)=>{
    direction = 1;
    if(sortfield == "popularity"){
      direction = -1;
    }
    if(sortfield == "character"){
      sortfield = "department";
    }
    if(sortfield == "department"){
      sortfield2 = "character";
    }
    if(sortfield == "role"){
      sortfield = "department";
      sortfield2 = "character";
    }
    movie.credits.crew = movie.credits.crew.sort(sortfunc(sortfield, direction));
    movie.credits.cast = movie.credits.cast.sort(sortfunc(sortfield2, direction));
    callback(null,movie);
  }).catch((err)=>{callback(err,null);});
}

// returns the entire person object from database
module.exports.getPerson = (info,callback) => {
  var sortField = info.query.sort || "popularity"
  persons.findOne({id: info.query.id}).populate('cast_movies._id','title poster_path id popularity release_date').populate('crew_movies._id','title poster_path id popularity release_date').then((p)=>{
    var arr = [];
    var arr1 = [];
    var arr2 = [];

    var direction = 1;
    if(sortField == "popularity" || sortField == "release_date"){
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
  info.query.num = 5;
  info.query.fullq = `(^| )${info.query.q}.*`;
  return module.exports.search(info,callback);
}

// replace letter at position with letter
function replaceAt(str, pos, letter){
  return str.substring(0,pos) + letter + str.substring(pos+1);
}
function reverseAt(str, pos){
  return str.substring(0,pos) + str.charAt(pos+1) + str.charAt(pos) + str.substring(pos+2);
}
function insertAt(str, pos, letter){
  return str.substring(0,pos) + letter + str.substring(pos);
}
function removeAt(str, pos){
  return str.substring(0,pos) + str.substring(pos+1);
}
async function isResult(str){
  var result = await global_search.findOne({
    $and:
      [
        {$text:
          {$search: str}},
        {name:
          {$regex: stdregex(str), $options: 'i'}
        }
      ]
  });
  if(result != undefined){
    return true;
  }
  else return false;
}
function stdregex(str){
  return `(^| )(${str})((?!a-zA-Z\d))`;
}

async function correction(querynr){
  // if gets results, return them.
  if(await global_search.findOne({name: {$regex: stdregex(querynr), $options: 'i'}}) != undefined){
    return querynr;
  }
  // else find lots of possible corrections until one does return results
  else{
    //var all = await global_search.find({},"name");
    //console.log(all);
    var newq = querynr;
    var letter = "";
    var count = 0;
    console.log("TET");
    startTime = new Date();
    // swap each adjacent letter-set
    for ( var i = 0; i < querynr.length-1; i++){
      newq = reverseAt(querynr,i);
      console.log(newq);
      count++;
      if(await isResult(newq)){
        return newq;
      }
    }
    // remove each letter
    for ( var i = 0; i < querynr.length; i++){
      newq = removeAt(querynr,i);
      console.log(newq);
      count++;
      if(await isResult(newq)){
        return newq;
      }
    }
    // add each letter between each 2 letters
    for ( var l = 0; l < 26; l++ ){
      letter = String.fromCharCode(97+l);
      for (var i = 0; i < querynr.length+1; i++){
        newq = insertAt(querynr,i,letter);
        console.log(newq);
        count++;
        if(await isResult(newq)){
          return newq;
        }
      }
    }
    // replace each letter with each possible letter
    for ( var l = 0; l < 26; l++ ){
      letter = String.fromCharCode(97+l);
      for (var i = 0; i < querynr.length; i++) {
        newq = replaceAt(querynr,i,letter);
        console.log(newq);
        count++;
        if(await isResult(newq)){
          return newq;
        }
      }
    }
    endTime = new Date();
    var timeDiff = endTime - startTime;
    console.log(timeDiff + " ms");
    console.log(count + " queries");
  }
}

// returns {movies: arr, people: arr}
module.exports.search = async (info,callback) => {
  // get args
  var q = await correction(info.query.q);
  var query = info.query.fullq || stdregex(q);
  var sortfield = info.query.sort || 'popularity';
  var limit = parseInt(info.query.num) || 100;
  var start_from = parseInt(info.query.start) || 0;
  // run find operations for titles or names containing the query
  console.log(query);
  // sort reverse if popularity is the sort field
  var dir = 1;
  if(sortfield == "popularity"){
    dir *= -1;
  }

  global_search.find({$and: [{$text: {$search: q}}, {name: {$regex: query, $options: 'i'}}]}).populate('item', 'id title name poster_path profile_path cast_movies crew_movies popularity').sort({[sortfield]: dir}).limit(limit).skip(start_from).then((results)=>{
    // after gettings results normalize movie and people fields.
    var finalresults = results.map((result) => {
      if(result.type == "movies"){
        var ret = {id: result.item.id, name: result.item.title, image: result.item.poster_path, popularity: result.popularity, originalq: info.query.q, q: q, type: removeAt(result.type, result.type.length-1)};
        return ret;
      }else{
        var ret = {id: result.item.id, name: result.item.name, image: result.item.profile_path, popularity: result.popularity, roles: {characters: result.item.cast_movies, departments: result.item.crew_movies}, originalq: info.query.q, q: q, type: removeAt(result.type, result.type.length-1)};
        return ret;
      }
    });
    callback(false,finalresults);
  }).catch((err)=>{callback(err,null);});
}


// ----------
// users methods

module.exports.getUserProfile = (info,callback) => {
  users.findOne({_id: mongoose.Types.ObjectId(info)}, callback);
}

module.exports.registerUser = (info, res) => {
  var newUser = new users({id: Math.floor(Math.random() * 10000), username: info.body.username, hash: null, salt: null});
  newUser.setPassword(info.body.password);
  newUser.save(function (err) {
    if (err) {
      res.status(401);
      res.json({"err":err});
      res.end();
    }
    else {
      var jwtoken = newUser.generateJwt();
      res.status(200);
      res.json({"token":jwtoken});
      res.end();
    }
  });
}

module.exports.deleteUser = (info,callback) => {
  users.deleteOne({id: info.query.id}, callback);
}

module.exports.authenticateUser = (req, res) => {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      res.json(err);
      return;
    }
    if (user) {
      var token = user.generateJwt();
      res.status(200).json({"token": token});
      res.end();
    }
    else {
      res.status(401).json(info);
    }
  })(req, res);
}

module.exports.addFavorite = (info, callback) => {
  var query = movies.findOne({"id": info.body.mid });
  query.select('title id imdb_id popularity poster_path').exec(function (err, movie) {
    users.findByIdAndUpdate(info.body.uid, { $addToSet: { "favorites": movie } }, callback);
  })
}

module.exports.removeFavorite = (info, callback) => {
  var query = movies.findOne({"id": info.body.mid });
  query.select('title id imdb_id popularity poster_path').exec(function (err, movie) {
    users.findByIdAndUpdate(info.body.uid, { $pull: { "favorites": movie } }, callback);
  })
}

module.exports.getFavorites = (info, callback) => {
  console.log("ttt");
  users.findOne({_id: info.query.id}, "favorites").then((e)=>{
    console.log(e);
    callback(false,e.favorites);
  }).catch((err)=>{callback(err,null);});
}
