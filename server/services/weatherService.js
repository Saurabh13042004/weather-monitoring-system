const axios = require('axios');
const WeatherData = require('../models/WeatherData');
const DailySummary = require('../models/DailySummary');
const Alert = require('../models/Alert');
const Config = require('../models/Config');
const AlertConfig = require('../models/AlertConfig');

class WeatherService {
  constructor(io) {
    this.io = io;
    this.cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.updateInterval = null;
    this.updateIntervalId = null;
  }

  async startMonitoring() {
    const config = await Config.findOne() || await Config.create({ updateInterval: 60 });
    this.updateInterval = config.updateInterval * 60 * 1000;
    this.fetchAndProcessAllCities();
    this.updateIntervalId = setInterval(() => this.fetchAndProcessAllCities(), this.updateInterval);
  }
  async updateConfig(newConfig) {
    if (newConfig.updateInterval) {
      this.updateInterval = newConfig.updateInterval * 60 * 1000;
      clearInterval(this.updateIntervalId);
      this.updateIntervalId = setInterval(() => this.fetchAndProcessAllCities(), this.updateInterval);
    }
  }

  async fetchAndProcessAllCities() {
    for (const city of this.cities) {
      const data = await this.fetchCityWeather(city);
      if (data) {
        await this.processWeatherData(data);
        this.io.emit('weatherUpdate', { [city]: data });
      }
    }
  }

  async fetchCityWeather(city) {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${this.apiKey}`);
      const currentTime = Math.floor(Date.now() / 1000);
      return {
        city,
        main: response.data.weather[0].main,
        temp: this.kelvinToCelsius(response.data.main.temp),
        feels_like: this.kelvinToCelsius(response.data.main.feels_like),
        humidity: response.data.main.humidity,
        wind_speed: response.data.wind.speed,
        dt: currentTime,
        timestamp: new Date(currentTime * 1000).toISOString()
      };
    } catch (error) {
      console.error(`Error fetching weather for ${city}:`, error);
      return null;
    }
  }

  async processWeatherData(data) {
    await WeatherData.create(data);
    await this.updateDailySummary(data);
    await this.checkAlertThresholds(data);
  }
  
  async updateDailySummary(data) {
    const date = new Date(data.dt * 1000).toISOString().split('T')[0];
    const summary = await DailySummary.findOne({ city: data.city, date });

    if (summary) {
      const weatherData = await WeatherData.find({ city: data.city, dt: { $gte: new Date(date).getTime() / 1000 } });
      const temperatures = weatherData.map(w => w.temp).filter(temp => !isNaN(temp));
      const humidities = weatherData.map(w => w.humidity).filter(humidity => !isNaN(humidity));
      const windSpeeds = weatherData.map(w => w.wind_speed).filter(speed => !isNaN(speed));
      const conditions = weatherData.map(w => w.main);

      summary.avgTemp = this.calculateAverage(temperatures);
      summary.maxTemp = Math.max(...temperatures);
      summary.minTemp = Math.min(...temperatures);
      summary.dominantCondition = this.getDominantCondition(conditions);
      summary.avgHumidity = this.calculateAverage(humidities) || 0;
      summary.avgWindSpeed = this.calculateAverage(windSpeeds) || 0;

      await summary.save();
    } else {
      await DailySummary.create({
        city: data.city,
        date,
        avgTemp: data.temp || 0,
        maxTemp: data.temp || 0,
        minTemp: data.temp || 0,
        dominantCondition: data.main,
        avgHumidity: data.humidity || 0,
        avgWindSpeed: data.wind_speed || 0
      });
    }
  }

  async checkAlertThresholds(data) {
    const alertConfig = await AlertConfig.findOne({ city: data.city });
    if (!alertConfig) return;

    const recentReadings = await WeatherData.find({
      city: data.city,
      dt: { $gte: Date.now() / 1000 - 30 * 60 }
    }).sort('-dt').limit(2);

    if (recentReadings.length >= 2 &&
        recentReadings.every(reading => reading.temp > alertConfig.threshold)) {
      const alert = await Alert.create({
        city: data.city,
        message: `Temperature exceeded ${alertConfig.threshold}°C for consecutive readings`,
        temperature: data.temp,
        threshold: alertConfig.threshold
      });
      this.io.emit('weatherAlert', alert);
      console.log(`Alert triggered for ${data.city}: ${alert.message}`);
      if (alertConfig.email) {
        console.log(`Sending email alert to ${alertConfig.email}`);
        // Implement email sending logic here
      }
    }
  }

  kelvinToCelsius(kelvin) {
    return Math.round((kelvin - 273.15) * 10) / 10;
  }

  calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    return Math.round((numbers.reduce((a, b) => a + b) / numbers.length) * 10) / 10;
  }

  getDominantCondition(conditions) {
    const counts = conditions.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }
}

module.exports = WeatherService;