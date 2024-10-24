import React from 'react';

const WeatherCard = ({ weather }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{weather.city}</h2>
      <p className="text-gray-700 text-lg mb-2">🌡️ Temperature: {weather.temp}°C</p>
      <p className="text-gray-700 text-lg mb-2">🌡️ Feels Like: {weather.feels_like}°C</p>
      <p className="text-gray-700 text-lg">🌤️ Condition: {weather.condition}</p>
    </div>
  );
};

export default WeatherCard;
