const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
  updateInterval: { type: Number, default: 5 },
  temperatureUnit: { type: String, enum: ['celsius', 'fahrenheit'], default: 'celsius' }
});

module.exports = mongoose.model('Config', ConfigSchema);