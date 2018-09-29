const express = require('express');
const router = express.Router();
const db = require('../models/db.js');

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
})


router.get('/users',(req,res) => {
  db.getUserById(req,(err,lists)=>{
    if(err){
      res.json({success:false, message: `database error: ${err}`});
    }
    else{
      res.write(JSON.stringify(lists,null,2));
      res.end();
    }
  })
})



router.post('/users/register',(req,res) => {
  db.registerUser(req,(err,lists)=>{
    if(err){
      res.json({success:false, message: `database error: ${err}`});
    }
    else{
      res.write(JSON.stringify(lists,null,2));
      res.end();
    }
  })
})

router.delete('/users',(req,res) => {
  db.deleteUser(req,(err,lists)=>{
    if(err){
      res.json({success:false, message: `database error: ${err}`});
    }
    else{
      res.write(JSON.stringify(lists,null,2));
      res.end();
    }
  })
})
module.exports = router;
