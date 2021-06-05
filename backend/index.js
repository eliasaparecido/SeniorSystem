const express = require('express');
const  cors = require('cors');
const server = express();

const axios = require('axios');

server.use(cors());

server.use(
    express.urlencoded({
      extended: true
    })
  )
  
server.use(express.json());

const URLAPI = 'https://jsonmock.hackerrank.com/api/movies/';

const getAllPages = async (moviename, result) => {

    let movies = [];

    for (let page = 1; page <= result.total_pages; page++) {
        let response = await axios.get(`${URLAPI}search/?Title=${moviename}&page=${page}`);
        let data = response.data.data       
        if(data.length > 0)
        {
            for (let index = 0; index < data.length; index++) {
                movies.push(data[index]);                        
            }
        }
    }

    return movies;
}

const getMoviesYear = async (movies) => {
    let moviesyear = []

    moviesyear = await  movies.reduce((obj, {Year}) => {
        if (!obj[Year]) obj[Year] = [];
        obj[Year].push(Year);
        return obj;
    }, {});

    return  Object.values(moviesyear) 
}

const getResultMovies = async (movies) => {
    let resultmovies = []

    for (let i = 0; i < movies.length; i++) {
        resultmovies.push(
            {
                year: movies[i][0], movies: movies[i].length
            }
        );      
    }

    return resultmovies;
}

const  searchurl = async (moviename) => {
    let result = [];
    let movies = [];
    let allmovies = 0;
    let moviesYear = [];
    let moviesByYear = [];
    let resultMovies = [];

    try {
        if(moviename === "")
        {
            let response = await axios.get(`${URLAPI}search`);
            result = response.data
        } else {
            let response = await axios.get(`${URLAPI}search/?Title=${moviename}`);
            result = response.data
        }

        allmovies = result.total;

        if(allmovies > 0){
            movies = await getAllPages(moviename, result)

            if (movies.length > 0)
            {
                moviesYear = await getMoviesYear(movies)
            }

            if (moviesYear.length > 0)
            {
                resultMovies = await getResultMovies(moviesYear)
            }
        }

        moviesByYear = [{moviesByYear: resultMovies}, {total: allmovies}]

    } catch (error) {
        console.log(error)
    }
    
    return moviesByYear
 }

 server.get('/search', (req, res) => {
    req.setTimeout(50000000);
    const {movie} = req.query;
    
    searchurl(movie).then(response => {
        return res.json(response);
    }).catch(error => {
        return res.json(error);
    });   
});

server.listen(3001);