'use client'

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster, toast } from 'react-hot-toast';
import WeatherCarousel from './WeatherCarousel';
import WeatherChart from './WeatherChart';
import AlertsLog from './AlertsLog';
import DailySummary from './DailySummary';
import ConfigPanel from './ConfigPanel';
import AlertConfig from './AlertConfig';

const API_BASE_URL = 'http://localhost:3000/api';
const SOCKET_URL = 'http://localhost:3000';

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

interface WeatherData {
  [city: string]: {
    temp: number;
    feels_like: number;
    main: string;
    humidity: number;
    wind_speed: number;
  };
}

interface Alert {
  city: string;
  message: string;
  temperature: number;
  threshold: number;
  timestamp: string;
}

interface Config {
  updateInterval: number;
}

export default function App() {
  const [weatherData, setWeatherData] = useState<WeatherData>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [config, setConfig] = useState<Config>({ updateInterval: 60 });
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [temperatureUnit, setTemperatureUnit] = useState('celsius');

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL);

    socket.on('weatherUpdate', (data: WeatherData) => {
      setWeatherData(prevData => {
        const newData = { ...prevData };
        Object.keys(data).forEach(city => {
          newData[city] = { ...newData[city], ...data[city] };
        });
        return newData;
      });
      toast.success('Weather data updated');
    });

    socket.on('weatherAlert', (alert: Alert) => {
      setAlerts(prevAlerts => [...prevAlerts, alert]);
      toast.error(`Alert: ${alert.message} in ${alert.city}`);
    });

    fetchInitialData();

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const [weatherResponse, alertsResponse, configResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/current`),
        fetch(`${API_BASE_URL}/alerts`),
        fetch(`${API_BASE_URL}/config`)
      ]);

      const weather: WeatherData = await weatherResponse.json();
      const alertsData: Alert[] = await alertsResponse.json();
      const configData: Config = await configResponse.json();

      setWeatherData(weather);
      setAlerts(alertsData);
      setConfig(configData);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to fetch initial data');
    }
  };

  const updateConfig = async (newConfig: Partial<Config>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      });
      const updatedConfig: Config = await response.json();
      setConfig(updatedConfig);
      toast.success('Configuration updated successfully');
    } catch (error) {
      console.error('Error updating configuration:', error);
      toast.error('Failed to update configuration');
    }
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const handleTemperatureUnitChange = (unit: string) => {
    setTemperatureUnit(unit);
  };

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="w-full max-w-4xl">
        <Toaster position="top-right" />
        <h1 className="text-3xl font-bold mb-4 text-center">Weather Monitoring System</h1>
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="current">Current Weather</TabsTrigger>
            <TabsTrigger value="historical">Historical Data</TabsTrigger>
            <TabsTrigger value="summary">Daily Summary</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <WeatherCarousel weatherData={weatherData} temperatureUnit={temperatureUnit} />
          </TabsContent>
          <TabsContent value="historical">
            <WeatherChart cities={cities} temperatureUnit={temperatureUnit} selectedCity={selectedCity} onCityChange={handleCityChange} />
          </TabsContent>
          <TabsContent value="summary">
            <DailySummary city={selectedCity} temperatureUnit={temperatureUnit} />
          </TabsContent>
          <TabsContent value="alerts">
            <AlertsLog alerts={alerts} />
          </TabsContent>
          <TabsContent value="config">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ConfigPanel 
                config={config} 
                updateConfig={updateConfig} 
                temperatureUnit={temperatureUnit}
                onTemperatureUnitChange={handleTemperatureUnitChange}
              />
              <AlertConfig />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}