const mongoose = require('mongoose');
const DailySummary = require('../models/DailySummary');
require('dotenv').config();

const generateDailySummaryData = async () => {
  const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
  const weatherConditions = ['Clear', 'Rain', 'Clouds', 'Snow'];
  const data = [];
  
  // Generate data for last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    cities.forEach(city => {
      // Generate random temperatures between 20-35°C
      const temperatures = Array.from({ length: 24 }, () => 
        Math.round(20 + Math.random() * 15)
      );
      
      // Generate random weather conditions
      const conditions = Array.from({ length: 24 }, () => 
        weatherConditions[Math.floor(Math.random() * weatherConditions.length)]
      );

      data.push({
        city,
        date: dateString,
        temperatures,
        weatherConditions: conditions,
        avgTemp: Math.round(temperatures.reduce((a, b) => a + b) / temperatures.length),
        maxTemp: Math.max(...temperatures),
        minTemp: Math.min(...temperatures),
        dominantCondition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)]
      });
    });
  }

  await DailySummary.insertMany(data);
};

mongoose.connect("mongodb+srv://admin:admin@cluster0.b4osj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(async () => {
    console.log('Connected to MongoDB');
    await DailySummary.deleteMany({}); // Clear existing data
    await generateDailySummaryData();
    console.log('Daily summary data generated successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
