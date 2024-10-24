const pool = require('../config/db');

const createWeatherSummary = async (data) => {
  const query = `
    INSERT INTO weather_summary (city, avg_temp, max_temp, min_temp, dominant_condition, timestamp)
    VALUES ($1, $2, $3, $4, $5, NOW())
  `;
  const { city, avgTemp, maxTemp, minTemp, dominantCondition } = data;
  await pool.query(query, [city, avgTemp, maxTemp, minTemp, dominantCondition]);
};

module.exports = { createWeatherSummary };
