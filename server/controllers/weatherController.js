// controllers/weatherController.js

const axios = require('axios');
const WeatherSummary = require('../models/weatherSummary')

async function fetchWeatherData(cities) {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const weatherUpdates = [];

    for (const city of cities) {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = response.data;

        const weatherInfo = {
            city,
            temp: data.main.temp,
            feels_like: data.main.feels_like,
            condition: data.weather[0].main,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            dt: new Date(data.dt * 1000), 
        };

        weatherUpdates.push(weatherInfo);
    }

    return weatherUpdates;
}

async function saveDailySummary(weatherUpdates) {
    const date = new Date().toISOString().split('T')[0];
    
    // Group by city and calculate aggregates
    const summaries = {};

    for (const update of weatherUpdates) {
        const city = update.city;
        if (!summaries[city]) {
            summaries[city] = {
                city,
                totalTemp: 0,
                maxTemp: -Infinity,
                minTemp: Infinity,
                count: 0,
                conditionsCount: {},
                totalHumidity: 0,
                totalWindSpeed: 0,
            };
        }

        summaries[city].totalTemp += update.temp;
        summaries[city].maxTemp = Math.max(summaries[city].maxTemp, update.temp);
        summaries[city].minTemp = Math.min(summaries[city].minTemp, update.temp);
        summaries[city].count++;
        
        // Count conditions for dominant condition calculation
        if (!summaries[city].conditionsCount[update.condition]) {
            summaries[city].conditionsCount[update.condition] = 0;
        }
        summaries[city].conditionsCount[update.condition]++;
        
        // Aggregate humidity and wind speed for bonus features
        summaries[city].totalHumidity += update.humidity;
        summaries[city].totalWindSpeed += update.windSpeed;
    }

    // Save summary to MongoDB or any other storage solution
    for (const city in summaries) {
        const summaryData = summaries[city];
        const averageTemperature = summaryData.totalTemp / summaryData.count;
        
        // Determine dominant condition based on counts
        const dominantCondition = Object.keys(summaryData.conditionsCount).reduce((a, b) => 
            summaryData.conditionsCount[a] > summaryData.conditionsCount[b] ? a : b);

        const summary = new WeatherSummary({
            city: summaryData.city,
            date,
            averageTemperature,
            maxTemperature: summaryData.maxTemp,
            minTemperature: summaryData.minTemp,
            dominantCondition,
            humidity: summaryData.totalHumidity / summaryData.count, // Average humidity
            windSpeed: summaryData.totalWindSpeed / summaryData.count, // Average wind speed
        });

        await summary.save();
    }
}

module.exports = { fetchWeatherData, saveDailySummary };