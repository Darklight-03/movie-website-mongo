const express = require('express');
const router = express.Router();
const movielist = require('../models/list.js');

//GET HTTP method 
router.get('/movie_id',(req,res) => {
  movielist.getMovie(req,(err, lists)=> {
    if(err) {
      res.json({success:false, message: `Can\'t load data. Error: ${err}`});
    }
    else {
      res.write(JSON.stringify(lists,null,2));
      res.end();
    }
  });
});


module.exports = router;
