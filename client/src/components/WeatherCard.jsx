// frontend/src/components/WeatherCard.jsx

import React from 'react';

const WeatherCard = ({ city }) => {
    return (
        <div className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{city.city}</h2>
            <p>Temperature: {city.temp}°C</p>
            <p>Feels Like: {city.feels_like}°C</p>
            <p>Condition: {city.main}</p>
            <p>Humidity: {city.humidity}%</p>
            <p>Wind Speed: {city.wind_speed} m/s</p>
        </div>
    );
};

export default WeatherCard;