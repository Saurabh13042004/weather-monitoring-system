// src/WeatherSummary.js
import React from 'react';

const WeatherSummary = ({ summary }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-5 mb-4">
            <h2 className="text-xl font-bold">{summary.city}</h2>
            <p>Date: {summary.date}</p>
            <p>Average Temperature: {summary.averageTemperature} °C</p>
            <p>Max Temperature: {summary.maxTemperature} °C</p>
            <p>Min Temperature: {summary.minTemperature} °C</p>
            <p>Dominant Condition: {summary.dominantCondition}</p>
            <p>Average Humidity: {summary.humidity} %</p>
            <p>Average Wind Speed: {summary.windSpeed} m/s</p>
        </div>
    );
};

export default WeatherSummary;