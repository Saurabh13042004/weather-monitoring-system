// routes/weatherRoutes.js

const express = require('express');
const router = express.Router();
const { fetchWeatherData, saveDailySummary } = require('../controllers/weatherController');

// Define cities to monitor
const citiesToMonitor = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

// Route to fetch and save daily weather data manually (for testing)
router.get('/fetch', async (req, res) => {
    try {
        const weatherUpdates = await fetchWeatherData(citiesToMonitor);
        await saveDailySummary(weatherUpdates);
        
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

module.exports = router;