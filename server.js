require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const axios = require('axios');
const fs = require('fs');
const app = express();
const key = '9cf61e91'

// Sets EJS as the view engine
app.set('view engine', 'ejs');
// Specifies the location of the static assets folder
app.use(express.static('static'));
// Sets up body-parser for parsing form data
app.use(express.urlencoded({ extended: false }));
// Enables EJS Layouts middleware
app.use(ejsLayouts);

// Adds some logging to each request
app.use(require('morgan')('dev'));

// Routes
app.get('/', function(req, res) {
  res.render('index');
});


app.get('/results', function(req, res) {
  const queryString = {
  params: {
    s: req.query.movie,
    apiKey: key,
  }

};

axios.get('http://omdbapi.com', queryString)
        .then(function (omdbResponse) {
          console.log(omdbResponse.data.Search);
          res.render('results', {movies: omdbResponse.data.Search})
        });
});


// app.get route for returning 1 value for returning 1 IMDb id movie/:id

// The app.listen function returns a server handle
var server = app.listen(process.env.PORT || 3000);

// We can export this server to other servers like this
module.exports = server;
