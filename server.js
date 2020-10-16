require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const axios = require('axios');
const app = express();


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
    apiKey: process.env.OMDB_API_KEY,
  }

};

axios.get('http://omdbapi.com', queryString)
        .then(function (omdbResponse) {
          console.log(omdbResponse.data.Search);
          res.render('results', {movies: omdbResponse.data.Search})
        });
});

app.get('/movies/:id', function(req, res) {
  const queryString = {
    params: {
      i: req.params.id,
      // 'apiKey' comes from the docs AND the key they sent to us
      apiKey: process.env.OMDB_API_KEY
    }
  }

  axios.get('http://www.omdbapi.com/', queryString)
  .then(function (omdbResponse) {
    res.render('detail', { movie: omdbResponse.data })
  })
})

// app.get('/movies/:movie_id', function (req, res) {
//   // have to search within omdbResponse.data.Search.imdbID
//   // find a way to look through an API maybe with axios and try to
//   // render all of the info on /details for a single movie.
//   // even take the results from the results page and be able to go
//   // to details by using the imdbID.
//   const queryString = {
//     params: {
//       i: req.params.id,
//       apiKey: key,
//     }
//   }

//   axios.get('http://omdbapi.com', queryString)
//     .then(function (omdbResponse) {
//       res.render('detail', {movie: omdbResponse.data})
//     })
// })

// The app.listen function returns a server handle
const server = app.listen(process.env.PORT || 3000);

// We can export this server to other servers like this
module.exports = server;
