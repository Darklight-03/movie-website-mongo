const express = require('express');
const router = express.Router();
const db = require('../models/db.js');

//GET HTTP method 
router.get('/movie_id',(req,res) => {
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
