import { useState, useEffect } from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const API_BASE_URL = 'https://weather-monitoring-system-321u.onrender.com/api';

interface WeatherChartProps {
  cities: string[];
  temperatureUnit: string;
  selectedCity: string;
  onCityChange: (city: string) => void;
}

interface HistoricalData {
  dt: number;
  temp: number;
}

const WeatherChart = ({ cities, temperatureUnit, selectedCity, onCityChange }: WeatherChartProps) => {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  useEffect(() => {
    fetchHistoricalData();
  }, [selectedCity]);

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/historical/${selectedCity}`);
      const data: HistoricalData[] = await response.json();
      setHistoricalData(data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  const convertTemperature = (temp: number) => {
    return temperatureUnit === 'fahrenheit' ? (temp * 9/5) + 32 : temp;
  };

  const formattedData = historicalData.map(entry => ({
    time: new Date(entry.dt * 1000).toLocaleString(),
    temperature: convertTemperature(entry.temp)
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Weather Data</CardTitle>
        <Select value={selectedCity} onValueChange={onCityChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#8884d8" name={`Temperature (°${temperatureUnit === 'celsius' ? 'C' : 'F'})`} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherChart;