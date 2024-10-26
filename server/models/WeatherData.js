const mongoose = require('mongoose');

const WeatherDataSchema = new mongoose.Schema({
  city: String,
  main: String,
  temp: Number,
  feels_like: Number,
  humidity: Number,
  wind_speed: Number,
  dt: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WeatherData', WeatherDataSchema);