const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const movies = require('./controllers/movies');

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

app.use('/present', movies);

//Listen to port 3000
app.listen(port, () => {
    console.log(`Starting the server at port ${port}`);
});


