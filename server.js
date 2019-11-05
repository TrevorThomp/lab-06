'use strict';

require('dotenv').config();

const express =require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || PORT;

app.use(cors());

app.get('/location', (request,response) => {
  try {
    const geoData = require('./data/geo.json');
    const city = request.query.data;
    const locationData = new Location(city,geoData);
    response.send(locationData);
  }
  catch(error) {
    errorHandler('Something went wrong', request,response);
  }
})

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

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));