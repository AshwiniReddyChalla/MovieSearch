const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const apiKey = '*****************************';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  let url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
  request(url, function (err, response, body) {
    if(err){
      res.render('index', {movies: null, error: 'Error occured, please try again'});
    } else {
      let bodyJson = JSON.parse(body);
      if(bodyJson.results == undefined){
      	res.render('index', {movies: null, error: 'No movies found'});
      }else{
      	let movies = bodyJson.results.map( movie => {
      		return {'title' : movie.title, 'id' : movie.id};
      	});
      	res.render('index', {movies: movies, error: null});
      }
    }
  });
})

app.post('/', function (req, res) {
	let movieName = req.body.movieName;
	let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieName}&page=1`
  	request(url, function (err, response, body) {
    if(err){
      res.render('index', {movies: null, error: 'Error occured, please try again'});
    } else {
      let bodyJson = JSON.parse(body);
      if(bodyJson.results == undefined){
      	res.render('index', {movies: null, error: 'No movies found'});
      }else{
      	let movies = bodyJson.results.map( movie => {
      		return {'title' : movie.title, 'id' : movie.id};
      	});
      	res.render('index', {movies: movies, error: null});
      }
    }
  });
})

app.get('/movie', function (req, res) {
  let query = require('url').parse(req.url,true).query;
  let movieId = query.id;
  let url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
  request(url, function (err, response, body) {
    if(err){
      res.render('movie', {movie: null, error: 'Error occured, please try again'});
    } else {
      let bodyJson = JSON.parse(body);
      res.render('movie', {movie: 
      		{'title' : bodyJson.title, 
      		 'overview' : bodyJson.overview, 
      		 'tagline' : bodyJson.tagline,
      		 'production' : bodyJson.production_companies.map(company => {return company.name}),
      		 'genres' : bodyJson.genres.map(genre => {return genre.name}),
      	     'languages' : bodyJson.spoken_languages.map(lang => {return lang.name}),
      	     'releaseDate' : bodyJson.release_date
      	    }, error: null});
    }
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})