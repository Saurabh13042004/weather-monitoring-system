// controllers/weatherController.js

const axios = require('axios');

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

async function getWeatherData(req, res) {
    try {
        const responses = await Promise.all(cities.map(city =>
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`)
        ));

        const weatherData = responses.map(response => ({
            city: response.data.name,
            main: response.data.weather[0].main,
            temp: response.data.main.temp,
            feels_like: response.data.main.feels_like,
            dt: response.data.dt,
        }));

        res.json(weatherData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching weather data');
    }
}

module.exports = { getWeatherData };