const express = require('express');
const router = express.Router();
const movielist = require('../models/list.js');

//GET HTTP method 
router.get('/',(req,res) => {
  movielist.getAllLists((err, lists)=> {
    if(err) {
      res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
    }
    else {
      res.write(JSON.stringify({success: true, lists:lists},null,2));
      res.end();
    }
  });
});

//POST HTTP method 

router.post('/', (req,res,next) => {
  res.send("POST");

});

//DELETE HTTP method Here, we pass in a params which is the object id.
router.delete('/:id', (req,res,next)=> {
  res.send("DELETE");

})

module.exports = router;
