const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  city: String,
  message: String,
  temperature: Number,
  threshold: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', AlertSchema);