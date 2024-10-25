const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const weatherRoutes = require('./routes/weatherRoutes');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { fetchWeatherData, saveDailySummary, checkAlerts } = require('./controllers/weatherController'); // Import the functions

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use('/api/weather', weatherRoutes); // Use weather routes

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Socket.IO setup for real-time updates
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Define cities to monitor and thresholds
const citiesToMonitor = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const thresholds = { temperature: 35 }; // User-configurable thresholds

// Function to fetch and save weather data every 5 minutes
async function fetchAndSaveWeatherData() {
    try {
        const weatherUpdates = await fetchWeatherData(citiesToMonitor);
        await saveDailySummary(weatherUpdates);
        await checkAlerts(weatherUpdates, thresholds);
    } catch (error) {
        console.error('Error fetching and saving weather data:', error);
    }
}

// Fetch weather data at an interval (e.g., every 5 minutes)
setInterval(fetchAndSaveWeatherData, 1000 * 60 * 5); // Change to 5 minutes

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});