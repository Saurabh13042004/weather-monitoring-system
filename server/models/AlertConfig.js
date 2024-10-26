const mongoose = require('mongoose');

const AlertConfigSchema = new mongoose.Schema({
  city: String,
  threshold: Number,
  email: String
});

module.exports = mongoose.model('AlertConfig', AlertConfigSchema);