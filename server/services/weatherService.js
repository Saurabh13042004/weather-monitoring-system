const axios = require('axios');
const { kelvinToCelsius } = require('../utils/temperature');
const { createWeatherSummary } = require('../models/weatherSummary');
require('dotenv').config();

const cities = [
  { name: 'Delhi', lat: 28.7041, lon: 77.1025 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
  { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
];

const apiKey = process.env.API_KEY;

// Fetch weather data from OpenWeatherMap API
const fetchWeatherData = async () => {
  try {
    const weatherData = await Promise.all(
      cities.map(async (city) => {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}`
        );
        const { temp, feels_like } = response.data.main;
        const condition = response.data.weather[0].main;

        return {
          city: city.name,
          temp: kelvinToCelsius(temp),
          feels_like: kelvinToCelsius(feels_like),
          condition,
        };
      })
    );

    return weatherData;
  } catch (error) {
    console.error(`Error fetching weather data: ${error.message}`);
    throw error;
  }
};

// Roll up daily summary
const calculateDailySummary = (weatherData) => {
  const citySummaries = weatherData.reduce((acc, data) => {
    if (!acc[data.city]) {
      acc[data.city] = {
        temps: [],
        conditions: {},
        maxTemp: -Infinity,
        minTemp: Infinity,
      };
    }

    acc[data.city].temps.push(parseFloat(data.temp));

    // Calculate max and min temps
    acc[data.city].maxTemp = Math.max(acc[data.city].maxTemp, data.temp);
    acc[data.city].minTemp = Math.min(acc[data.city].minTemp, data.temp);

    // Track conditions
    if (acc[data.city].conditions[data.condition]) {
      acc[data.city].conditions[data.condition]++;
    } else {
      acc[data.city].conditions[data.condition] = 1;
    }

    return acc;
  }, {});

  // Calculate averages and dominant condition
  const summaries = Object.entries(citySummaries).map(([city, summary]) => {
    const avgTemp = (
      summary.temps.reduce((sum, temp) => sum + temp, 0) / summary.temps.length
    ).toFixed(2);

    const dominantCondition = Object.keys(summary.conditions).reduce((a, b) =>
      summary.conditions[a] > summary.conditions[b] ? a : b
    );

    return {
      city,
      avgTemp,
      maxTemp: summary.maxTemp.toFixed(2),
      minTemp: summary.minTemp.toFixed(2),
      dominantCondition,
    };
  });

  return summaries;
};

// Store summaries in DB
const storeWeatherSummaries = async (summaries) => {
  for (const summary of summaries) {
    await createWeatherSummary(summary);
  }
};

module.exports = { fetchWeatherData, calculateDailySummary, storeWeatherSummaries };
