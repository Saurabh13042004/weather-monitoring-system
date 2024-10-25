// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeatherSummary from './components/WeatherSummary';

const App = () => {
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummaries = async () => {
            try {
                // Fetch all weather summaries
                const response = await axios.get('http://localhost:5000/api/weather/summaries');
                setSummaries(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching weather summaries');
                setLoading(false);
            }
        };

        fetchSummaries();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-3xl font-bold mb-5">Weather Summaries</h1>
            {summaries.length === 0 ? (
                <p>No weather summaries available.</p>
            ) : (
                summaries.map((summary) => (
                    <WeatherSummary key={summary._id} summary={summary} />
                ))
            )}
        </div>
    );
};

export default App;