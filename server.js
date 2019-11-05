'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();


const express =require('express');
const cors = require('cors');

const PORT = process.env.PORT;
const app = express();

app.use(cors());

app.use(express.static('./front-end'));

app.get('/location', (request,response) => {
  const geoData = require('./data/geo.json');
  const city = request.query.data;
  const locationData = new Location(city,geoData);
  response.send(locationData);
});

app.get('/weather', (request,response) => {
  const weatherData = require('./data/darksky.json');
  let forecastDataArray = [];

  for ( let i = 0; i < weatherData.daily.data.length; i++) {
    let forecastData = new Weather(i, weatherData);
    forecastDataArray.push(forecastData);
  }

  response.send(forecastDataArray);
})

function Weather(i, weatherData) {
  this.forecast = weatherData.daily.data[i].summary;
  this.time = weatherData.daily.data[i].time;
}

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

function  notFoundHandler(request,response) {
  response.status(404).send('huh?');
}

function errorHandler(error,request,response) {
  response.status(500).send(error);
}

app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));


