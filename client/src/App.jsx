import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import WeatherList from './components/WeatherList';

const socket = io('http://localhost:4000'); // Backend server URL

const App = () => {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    // Listen for real-time weather updates
    socket.on('weather-update', (data) => {
      setWeatherData(data);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.off('weather-update');
    };
  }, []);

  return (
    <div className="bg-blue-50 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Real-Time Weather Monitoring</h1>
      <WeatherList weatherData={weatherData} />
    </div>
  );
};

export default App;
