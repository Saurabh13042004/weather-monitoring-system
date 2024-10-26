
# Weather Monitoring System

This project is a real-time weather monitoring system that periodically retrieves weather data for six major cities in India using the OpenWeatherMap API. The backend processes the data, stores it in MongoDB, and serves it to the frontend, where it is visualized and monitored for temperature thresholds.
![image](https://github.com/user-attachments/assets/76585ad9-0b23-4616-b78b-c68c271bd443)





## Features

- Real-time weather data collection for Delhi, Mumbai, Chennai, Bangalore, Kolkata, and Hyderabad.
- Daily data aggregation (average, max, min temperatures).
- Configurable alerting thresholds for extreme temperature conditions.
- Historical weather data visualization.


## Tech Stack

**Client:** Vite + React + Tailwind CSS + ShadCN

**Server:** Node.js + Express + Socket.IO

**Database** MongoDB


## Installation

## Prerequisites
- Docker (if not using Docker, see Manual Setup below)
- OpenWeatherMap API Key
- MongoDB URI


### Docker Setup
 
- Clone the repository:

```bash
git clone https://github.com/Saurabh13042004/weather-monitoring-system.git
cd weather-monitoring-system

```
- Navigate to the server folder:

```bash
cd server

```

- Add your OpenWeatherMap API key and MongoDB URI to the docker-compose.yml file:

```bash
environment:
   - OPENWEATHER_API_KEY=your_openweather_api_key
   - MONGODB_URI=your_mongodb_uri
```

- Build and run the Docker containers:

```bash
docker-compose up --build

```
- Once the backend is up, note the server URL (e.g., http://localhost:5000). You'll use this for the frontend setup.


### Manual Setup (Without Docker)
 
- In the server folder, create an .env file:

```bash
touch .env


```
- Add the following environment variables to your .env file:

```bash
OPENWEATHER_API_KEY=your_openweather_api_key
MONGODB_URI=your_mongodb_uri


```

- Start the backend:

```bash
npm install
npm start

```

- Once the backend is up, note the server URL for the frontend setup.

## Frontend Setup

### Note: Environment variables for the frontend are pending deployment fixes for Vercel. Once resolved, setup instructions will be updated here.

In the frontend code, locate the API_BASE_URL constant in the configuration file.
Replace API_BASE_URL' with your backend server URL obtained from the setup above.


