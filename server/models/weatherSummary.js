const mongoose = require('mongoose');

const weatherSummarySchema = new mongoose.Schema({
    city: { type: String, required: true },
    date: { type: String, required: true },
    averageTemperature: { type: Number, required: true },
    maxTemperature: { type: Number, required: true },
    minTemperature: { type: Number, required: true },
    dominantCondition: { type: String, required: true },
    humidity: { type: Number, required: true },
    windSpeed: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('WeatherSummary', weatherSummarySchema);