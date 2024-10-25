// frontend/src/hooks/useWeather.js

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:5000");

const useWeather = () => {
    const [weatherData, setWeatherData] = useState([]);
    const [dailySummary, setDailySummary] = useState([]);
    
    const fetchWeatherData = async () => {
        const response = await fetch("http://localhost:5000/api/weather");
        const data = await response.json();
        setWeatherData(data);
    };

    const fetchDailySummary = async () => {
        const response = await fetch("http://localhost:5000/api/weather/summary");
        const data = await response.json();
        setDailySummary(data);
    };

    useEffect(() => {
        fetchWeatherData();
        fetchDailySummary();

        socket.on("weatherUpdate", () => {
            fetchWeatherData();
            fetchDailySummary();
        });

        return () => {
            socket.off("weatherUpdate");
        };
    }, []);

    return { weatherData, dailySummary };
};

export default useWeather;