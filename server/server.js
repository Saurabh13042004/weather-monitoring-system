const express = require('express');
const { fetchWeatherData, calculateDailySummary, storeWeatherSummaries } = require('./services/weatherService');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Email alert setup (optional)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASSWORD,
  },
});

const alertThresholds = {
  temp: 35, // Alert if temperature exceeds 35°C
};

// Send email alert
const sendAlert = (weather) => {
  const mailOptions = {
    from: process.env.ALERT_EMAIL,
    to: process.env.ALERT_EMAIL,
    subject: 'Weather Alert!',
    text: `Alert: The temperature in ${weather.city} has exceeded ${alertThresholds.temp}°C. Current temp: ${weather.temp}°C.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Alert sent: ' + info.response);
  });
};

// Fetch and process weather data every 5 minutes
setInterval(async () => {
  const weatherData = await fetchWeatherData();
  const summaries = calculateDailySummary(weatherData);

  // Check for alert thresholds
  weatherData.forEach((weather) => {
    if (parseFloat(weather.temp) > alertThresholds.temp) {
      sendAlert(weather);
    }
  });

  // Store daily summaries in the DB
  await storeWeatherSummaries(summaries);
}, 300000); // 5 minutes

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



