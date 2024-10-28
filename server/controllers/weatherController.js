const WeatherData = require('../models/WeatherData');
const DailySummary = require('../models/DailySummary');
const Alert = require('../models/Alert');
const Config = require('../models/Config');
const AlertConfig = require('../models/AlertConfig');
const WeatherService = require('../services/weatherService');

let weatherService;

exports.setWeatherService = (service) => {
  weatherService = service;
};

exports.getCurrentWeather = async (req, res) => {
    try {
      const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
      const result = {};
  
      for (const city of cities) {
        const latestWeather = await WeatherData.findOne({ city }).sort('-dt');
        if (latestWeather) {
          result[city] = latestWeather;
        } else {
          // If no data is found for a city, provide a placeholder
          result[city] = {
            city,
            main: 'N/A',
            temp: 0,
            feels_like: 0,
            humidity: 0,
            wind_speed: 0,
            dt: Math.floor(Date.now() / 1000),
            timestamp: new Date().toISOString()
          };
        }
      }
  
      res.json(result);
    } catch (error) {
      console.error("Error fetching current weather data", error);
      res.status(500).json({ error: "Error fetching current weather data" });
    }
  };

exports.getHistoricalWeather = async (req, res) => {
  try {
    const { city } = req.params;
    const data = await WeatherData.find({ city }).sort('-dt').limit(24);
    res.json(data);
  } catch (error) {
    console.error("Error fetching historical data:", error);
    res.status(500).json({ error: "Error fetching historical data" });
  }
};

exports.getDailySummary = async (req, res) => {
  try {
    const summaries = await DailySummary.find({
      city: req.params.city,
      date: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    }).sort('-date');

    res.json(summaries);
  } catch (error) {
    res.status(500).json({ error: "Error fetching daily summaries" });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort('-timestamp').limit(10);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching alerts" });
  }
};

exports.getConfig = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config({ updateInterval: 60 });
      await config.save();
    }
    res.json(config);
  } catch (error) {
    console.error("Error fetching configuration:", error);
    res.status(500).json({ error: "Error fetching configuration" });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const { updateInterval, temperatureUnit } = req.body;
    let  config = await Config.findOne();
    if (!config) {
      config = new Config();
    }
    config.updateInterval = updateInterval || config.updateInterval;
    config.temperatureUnit = temperatureUnit || config.temperatureUnit;
    await config.save();

    if (weatherService) {
      await weatherService.updateConfig(config);
    }

    res.json(config);
  } catch (error) {
    console.error("Error updating configuration:", error);
    res.status(500).json({ error: "Error updating configuration" });
  }
};

exports.getAlertConfig = async (req, res) => {
  try {
    let alertConfig = await AlertConfig.findOne();
    if (!alertConfig) {
      alertConfig = new AlertConfig({ city: "Delhi", threshold: 35 });
      await alertConfig.save();
    }
    res.json(alertConfig);
  } catch (error) {
    console.error("Error fetching alert configuration:", error);
    res.status(500).json({ error: "Error fetching alert configuration" });
  }
};

exports.updateAlertConfig = async (req, res) => {
  try {
    const { city, threshold, email } = req.body;
    let alertConfig = await AlertConfig.findOne();
    if (!alertConfig) {
      alertConfig = new AlertConfig();
    }
    alertConfig.city = city;
    alertConfig.threshold = threshold;
    alertConfig.email = email;
    await alertConfig.save();

    if (weatherService) {
      const latestWeatherData = await WeatherData.findOne({ city }).sort('-dt');
      await weatherService.checkAlertThresholds(latestWeatherData)
    }

    res.json(alertConfig);
  } catch (error) {
    console.error("Error updating alert configuration:", error);
    res.status(500).json({ error: "Error updating alert configuration" });
  }
};