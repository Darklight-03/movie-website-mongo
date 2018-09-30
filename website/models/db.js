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
  revenue: Number
});
const personsSchema = new Schema({
  name: String,
  id: Number,
  profile_path: String,
  cast_movies: [{_id: {type: Schema.Types.ObjectId, ref: 'movies'}, character: String}],
  crew_movies: [{_id: {type: Schema.Types.ObjectId, ref: 'movies'}, department: String}]
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
  favorites: [ {_id: {type: Schema.Types.ObjectId, ref: 'movies'}}]
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




// ----------
// users methods

module.exports.getUserById = (info,callback) => {
  users.findOne({id: info.query.id}, callback);
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

