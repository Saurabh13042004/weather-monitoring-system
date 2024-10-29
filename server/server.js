require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const WeatherService = require('./services/weatherService');
const weatherRoutes = require('./routes/weatherRoutes');
const weatherController = require('./controllers/weatherController');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.get('/',(req,res){
  res.send("server is started")
})
app.use('/api', weatherRoutes);

const weatherService = new WeatherService(io);
weatherController.setWeatherService(weatherService);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

async function startServer() {
  await weatherService.startMonitoring();

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);