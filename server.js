'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express =require('express');
const cors = require('cors');

const PORT = process.env.PORT;
const app = express();

app.use(cors());

// Routes
app.get('/location', handleLocation);
app.get('/weather', handleWeather)


// Function to handle geo.json data
function handleLocation(request,response){
  try {
    const city = request.query.data;
    const geoData = require('./data/geo.json');
    const locationData = new Location(city,geoData);
    response.send(locationData);
  }
  catch(error) {
    let message = errorHandler(error);
    response.status(message.status).send(console.log(message.responseText));
  }
};

// Function to handle darksky.json data
function handleWeather(request,response){
  try {
    const weatherData = require('./data/darksky.json');
    let dailyData = weatherData.daily.data;
    let forecastDataArray = [];
    dailyData.forEach(obj => {
      forecastDataArray.push(new Weather(new Date(obj.time * 1000).toDateString() , obj.summary))
    })
    response.send(forecastDataArray);
  }
  catch(error) {
    let message = errorHandler(error);
    response.status(message.status).send(message.responseText);
  }
};

// Weather Constructor Function
function Weather(day, weather) {
  this.forecast = weather;
  this.time = day;
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


