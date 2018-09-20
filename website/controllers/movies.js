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

module.exports = router;
