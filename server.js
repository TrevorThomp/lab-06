'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express =require('express');
const cors = require('cors');
const superagent = require('superagent')

const PORT = process.env.PORT;
const app = express();

app.use(cors());

// Routes
app.get('/location', handleLocation);
app.get('/weather', handleWeather)



function handleLocation(request,response) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODE_API_KEY}`;

  return superagent.get(url)
    .then(result => {
      const city = result.body;
      // const locationData = new Location(request.query.data , city);
      response.send(new Location(request.query.data , city));
    })
    .catch(error => {
      let message = errorHandler(error);
      response.status(message.status).send(console.log(message.responseText));
    });
}

// Function to handle darksky.json data
function handleWeather(request, response) {
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;

  return superagent.get(url)
    .then(result => {
      const weatherSummaries = result.body.daily.data.map(day => {
        return new Weather(day);
      });

      response.send(weatherSummaries);
    })
    .catch(error => {
      let message = errorHandler(error);
      response.status(message.status).send(console.log(message.responseText));
    });
}

// Weather Constructor Function
function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toDateString();
}

// Location Constructor Function
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

// Error Handler function to throw
function errorHandler() {
  let errObject = {
    status: 500,
    responseText: 'Sorry something went wrong',
  };
  return errObject;
}

// Error if route does not exist
app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));

// PORT to for the server to listen too
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));


