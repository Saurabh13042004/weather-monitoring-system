import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const App = () => {
    const [summaries, setSummaries] = useState([]);
    
    useEffect(() => {
        const fetchSummaries = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/weather/summaries');
                setSummaries(response.data);
            } catch (error) {
                toast.error('Error fetching weather summaries');
            }
        };
        fetchSummaries();
    }, []);
    
    return (
        <div className="App">
            <h1>Weather Summaries</h1>
            {summaries.map((summary) => (
                <div key={summary._id}>
                    <h2>{summary.city}</h2>
                    <p>Average Temp: {summary.averageTemperature}°C</p>
                </div>
            ))}
        </div>
    );
};

export default App;
