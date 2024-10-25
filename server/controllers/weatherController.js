const axios = require('axios');
const WeatherSummary = require('../models/weatherSummary');

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
        
        if (!summaries[city].conditionsCount[update.condition]) {
            summaries[city].conditionsCount[update.condition] = 0;
        }
        summaries[city].conditionsCount[update.condition]++;
        
        summaries[city].totalHumidity += update.humidity;
        summaries[city].totalWindSpeed += update.windSpeed;
    }

    for (const city in summaries) {
        const summaryData = summaries[city];
        const averageTemperature = summaryData.totalTemp / summaryData.count;
        
        const dominantCondition = Object.keys(summaryData.conditionsCount).reduce((a, b) => 
            summaryData.conditionsCount[a] > summaryData.conditionsCount[b] ? a : b);

        const summary = new WeatherSummary({
            city: summaryData.city,
            date,
            averageTemperature,
            maxTemperature: summaryData.maxTemp,
            minTemperature: summaryData.minTemp,
            dominantCondition,
            humidity: summaryData.totalHumidity / summaryData.count,
            windSpeed: summaryData.totalWindSpeed / summaryData.count,
        });

        await summary.save();
    }
}

async function checkAlerts(weatherUpdates, thresholds) {
    for (const update of weatherUpdates) {
        if (update.temp > thresholds.temperature) {
            console.log(`Alert: ${update.city} temperature exceeds ${thresholds.temperature}°C! Current: ${update.temp}°C`);
            // Implement email notification logic here if required
        }
    }
}

module.exports = { fetchWeatherData, saveDailySummary, checkAlerts };