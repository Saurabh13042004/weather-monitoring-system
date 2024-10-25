const mongoose = require('mongoose');

const weatherSummarySchema = new mongoose.Schema({
    city: String,
    date: String,
    averageTemperature: Number,
    maxTemperature: Number,
    minTemperature: Number,
    dominantCondition: String,
    humidity: Number,
    windSpeed: Number,
});

module.exports = mongoose.model('WeatherSummary', weatherSummarySchema);
