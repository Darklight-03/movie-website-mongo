const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const movies = require('./controllers/movies');
const pass = require('./config/passport');

const app = express();

const port = 3000;


// starting code: https://www.sitepoint.com/mean-stack-angular-2-angular-cli/
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) => {
  res.send("Invalid page");
})

// Connect mongoose to our database
const config = require('./config/database');
mongoose.connect(config.database, {useNewUrlParser: true});

// error handler
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

// send all requests that start with /dbservice to the movies controller
// (should probably be renamed to something more fitting like dbservice.
app.use(passport.initialize());
app.use('/dbservice', movies);


// this one use statment stolen from https://stackoverflow.com/questions/30546524/making-angular-routes-work-with-express-routes
app.use("*",function(req,res){
    res.sendFile(path.join(__dirname,"public/index.html"));
});

//Listen to port 3000
app.listen(port, () => {
  console.log(`Starting the server at port ${port}`);
});


