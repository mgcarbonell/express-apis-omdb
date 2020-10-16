// Setup
// 1. Installing the node module `dotenv`
// 2. Create a .env file
// 3. MAKE SURE to check that the .env file is included in .gitignore 
//    (and not added to any commits)
// 4. Add variables to the .env file
// 5. Add this line to main entrypoint file: require('dotenv').config();
// 6. Access .env variables with: process.env.YOUR_VARIABLE_NAME_HERE

require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const axios = require('axios');
const db = require('./models')
const app = express();





// Sets EJS as the view engine
app.set('view engine', 'ejs');
// Specifies the location of the static assets folder
app.use(express.static('static'));
// Sets up body-parser for parsing form data (saves within req.body)
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

app.post('/faves', function(req, res) {
  db.fave.create(req.body).then(newFave => {
    res.redirect('/faves') //redirect always makes a GET request to the path provided.
  })
})

// note adbout db.fave.findAll() since we're doing findAll() no search methods need to be passed in
app.get('/faves', function(req, res) {
  db.fave.findAll().then(allFaves => {
    res.render('faves', { faves: allFaves })
  } )
  // res.render('faves' )
})

// The app.listen function returns a server handle
var server = app.listen(process.env.PORT || 3000);

// We can export this server to other servers like this
module.exports = server;

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