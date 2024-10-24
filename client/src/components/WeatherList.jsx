import React from 'react';
import WeatherCard from './WeatherCard';

const WeatherList = ({ weatherData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {weatherData.length === 0 ? (
        <p className="text-lg text-gray-600">No weather data available</p>
      ) : (
        weatherData.map((weather, index) => (
          <WeatherCard key={index} weather={weather} />
        ))
      )}
    </div>
  );
};

export default WeatherList;
