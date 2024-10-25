// models/WeatherSummary.js

const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
    city: { type: String, required: true },
    date: { type: String, required: true }, // Store only date part (YYYY-MM-DD)
    averageTemperature: { type: Number, required: true },
    maxTemperature: { type: Number, required: true },
    minTemperature: { type: Number, required: true },
    dominantCondition: { type: String, required: true },
    humidity: { type: Number }, // Bonus feature
    windSpeed: { type: Number }, // Bonus feature
});

module.exports = mongoose.model('WeatherSummary', weatherSchema);