const express = require('express');
const router = express.Router();
const { fetchWeatherData, saveDailySummary, checkAlerts } = require('../controllers/weatherController');
const WeatherSummary = require('../models/weatherSummary');

// Define cities to monitor
const citiesToMonitor = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const thresholds = { temperature: 35 }; // User-configurable thresholds

// Route to fetch and save daily weather data manually (for testing)
router.get('/fetch', async (req, res) => {
    try {
        const weatherUpdates = await fetchWeatherData(citiesToMonitor);
        await saveDailySummary(weatherUpdates);
        await checkAlerts(weatherUpdates, thresholds);
        
        res.status(200).json({ message: 'Weather data fetched and saved successfully!', data: weatherUpdates });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching or saving weather data' });
    }
});

// Route to get all saved daily summaries from the database
router.get('/summaries', async (req, res) => {
    try {
        const summaries = await WeatherSummary.find().sort({ date: -1 });
        res.status(200).json(summaries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving daily summaries' });
    }
});

// Route to get weather summaries for a specific city on a specific date
router.get('/summaries/:city/:date', async (req, res) => {
    const { city, date } = req.params;
    try {
        const summary = await WeatherSummary.findOne({ city, date });
        if (!summary) {
            return res.status(404).json({ message: 'Summary not found' });
        }
        res.status(200).json(summary);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving summary' });
    }
});

// Route to set user-configurable thresholds for alerts
router.post('/thresholds', (req, res) => {
    const { temperature } = req.body;
    if (temperature) {
        thresholds.temperature = temperature; // Update the threshold
        return res.status(200).json({ message: 'Threshold updated successfully!', thresholds });
    }
    res.status(400).json({ message: 'Invalid threshold value' });
});

module.exports = router;