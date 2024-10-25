// routes/weatherRoutes.js

const express = require('express');
const axios = require('axios');
const router = express.Router();
const { getWeatherData } = require('../controllers/weatherController');

router.get('/', getWeatherData);

module.exports = router;