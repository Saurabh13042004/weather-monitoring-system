const mongoose = require('mongoose');

const DailySummarySchema = new mongoose.Schema({
  city: String,
  date: String,
  avgTemp: Number,
  maxTemp: Number,
  minTemp: Number,
  dominantCondition: String,
  avgHumidity: Number,
  avgWindSpeed: Number
});

module.exports = mongoose.model('DailySummary', DailySummarySchema);