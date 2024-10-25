const axios = require('axios');
const WeatherSummary = require('../models/weatherSummary');
const nodemailer = require('nodemailer');

const apiKey = process.env.OPENWEATHERMAP_API_KEY;
const thresholds = { temperature: 35 }; // Can be configured

const fetchWeatherData = async (cities) => {
    const weatherUpdates = [];
    for (const city of cities) {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = response.data;
        weatherUpdates.push({
            city,
            temp: data.main.temp,
            feels_like: data.main.feels_like,
            condition: data.weather[0].main,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            dt: new Date(data.dt * 1000),
        });
    }
    return weatherUpdates;
};

const saveDailySummary = async (weatherUpdates) => {
    const date = new Date().toISOString().split('T')[0];
    const summaries = {};

    weatherUpdates.forEach((update) => {
        const { city, temp, condition, humidity, windSpeed } = update;
        if (!summaries[city]) summaries[city] = { city, temps: [], conditions: {}, humidity: 0, windSpeed: 0, count: 0 };
        summaries[city].temps.push(temp);
        summaries[city].humidity += humidity;
        summaries[city].windSpeed += windSpeed;
        summaries[city].count++;
        summaries[city].conditions[condition] = (summaries[city].conditions[condition] || 0) + 1;
    });

    for (const city in summaries) {
        const data = summaries[city];
        const dominantCondition = Object.keys(data.conditions).reduce((a, b) => data.conditions[a] > data.conditions[b] ? a : b);
        const summary = new WeatherSummary({
            city: data.city,
            date,
            averageTemperature: data.temps.reduce((a, b) => a + b, 0) / data.count,
            maxTemperature: Math.max(...data.temps),
            minTemperature: Math.min(...data.temps),
            dominantCondition,
            humidity: data.humidity / data.count,
            windSpeed: data.windSpeed / data.count,
        });
        await summary.save();
    }
};

const checkAlerts = async (weatherUpdates) => {
    for (const update of weatherUpdates) {
        if (update.temp > thresholds.temperature) {
            console.log(`Alert: ${update.city} temperature exceeds ${thresholds.temperature}°C!`);
            await sendAlertEmail(update);
        }
    }
};

const sendAlertEmail = async (update) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD }
    });
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: 'user@example.com',
        subject: `Weather Alert for ${update.city}`,
        text: `Current temperature in ${update.city} is ${update.temp}°C, exceeding the threshold.`,
    });
};

const fetchAndSaveWeatherData = async () => {
    const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
    const weatherUpdates = await fetchWeatherData(cities);
    await saveDailySummary(weatherUpdates);
    await checkAlerts(weatherUpdates);
};

module.exports = { fetchWeatherData, saveDailySummary, checkAlerts, fetchAndSaveWeatherData };
