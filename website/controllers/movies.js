const express = require('express');
var jwt = require('express-jwt');
const router = express.Router();
const db = require('../models/db.js');

var auth = jwt({
  secret: process.env.MOVEDB_AUTH_SECRET,
  userProperty: 'payload'
});

//GET HTTP methods


// calls getMovie from db.js and returns it
router.get('/movie',(req,res) => {
  db.getMovie(req,(err, lists)=> {

    if(err) {
      res.json({success:false, message: `database error: ${err}`});
    }
    else {
      res.write(JSON.stringify(lists,null,2));
      res.end();
    }
  });
});

// calls topGrossing from db.js and returns it
router.get('/topgrossing',(req,res)=>{
  db.getTopGrossing(req,(err,lists)=>{
    if(err) {
      res.json({success:false, message: `database error: ${err}`});
    }
    else{
      res.write(JSON.stringify(lists,null,2));
      res.end();
    }
  });
});

//calls popularpeople from db.js and returns it
router.get('/popularpeople',(req,res)=>{
  db.getPopularPeople(req,(err,lists)=>{
    if(err){
      res,json({success:false, message: `database error: ${err}`});
    }
    else{
      res.write(JSON.stringify(lists,null,2));
      res.end();
    }
  });
});

//calls popularmovies from db.js and returns it
router.get('/popularmovies',(req,res)=>{
  db.getPopularMovies(req,(err,lists)=>{
    if(err){
      res,json({success:false, message: `database error: ${err}`});
    }
    else{
      res.write(JSON.stringify(lists,null,2));
      res.end();
    }
  });
});

// calls getPerson from db.js and returns
router.get('/person',(req,res) => {
  db.getPerson(req,(err,lists)=> {
    if(err) {
      res.json({success:false, message: `database error: ${err}`});
    }
    else{
      res.write(JSON.stringify(lists,null,2));
      res.end();
    }
  });
});

router.get('/autocomplete',(req,res)=>{
  db.autocomplete(req,(err,lists)=>{
    if(err){
      res.json({success:false, message: `database error: ${err}`});
    }
    else{
      res.write(JSON.stringify(lists,null,2));
      res.end();
    }
  })
});

// calls search from db.json and returns it.
router.get('/search',(req,res) => {
  db.search(req,(err,lists)=>{
    if(err){
      res.json({success:false, message: `database error: ${err}`});
    }
    else{
      res.write(JSON.stringify(lists,null,2));
      res.end();
    }
  })
});


router.get('/user', (req,res) => {
  if (!req.headers.callid) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    db.getUserProfile(req.headers.callid, function(err, user) {
        res.status(200).json(user);
      });
  }
});



router.post('/users/register',(req,res) => {
  db.registerUser(req, res);
});

router.post('/users/authenticate', (req,res) => {
  db.authenticateUser(req, res);
});

router.post('/user/addFavorite', (req,res) => {
  db.addFavorite(req,(err,lists)=> {
    if(err) {
      res.json({success:false, message: `database error: ${err}`});
    }
    else{
      res.write(JSON.stringify(lists,null,2));
      res.end();
    }
  });
})

router.post('/user/removeFavorite', (req,res) => {
  db.removeFavorite(req,(err,lists)=> {
    if(err) {
      res.json({success:false, message: `database error: ${err}`});
    }
    else{
      res.write(JSON.stringify(lists,null,2));
      res.end();
    }
  });
})
// router.delete('/user', auth, (req,res) => {
//   db.deleteUser(req,(err,lists)=>{
//     if(err){
//       res.json({success:false, message: `database error: ${err}`});
//     }
//     else{
//       res.write(JSON.stringify(lists,null,2));
//       res.end();
//     }
//   })
// });




module.exports = router;
