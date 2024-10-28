const mongoose = require('mongoose');

const AlertConfigSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('AlertConfig', AlertConfigSchema);