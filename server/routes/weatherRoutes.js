const express = require('express');
const router = express.Router();
const { fetchWeatherData, saveDailySummary, checkAlerts } = require('../controllers/weatherController');
const WeatherSummary = require('../models/weatherSummary');

router.get('/summaries', async (req, res) => {
    try {
        const summaries = await WeatherSummary.find().sort({ date: -1 });
        res.status(200).json(summaries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving summaries' });
    }
});

module.exports = router;
