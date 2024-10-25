// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const weatherRoutes = require('./routes/weatherRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));
app.use('/api/weather', weatherRoutes);

io.on('connection', (socket) => {
    console.log('A user connected');

    // Emit weather data to clients every 5 minutes
    setInterval(() => {
        socket.emit('weatherUpdate', { message: 'Fetching new weather data...' });
    }, 300000); // 5 minutes

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});