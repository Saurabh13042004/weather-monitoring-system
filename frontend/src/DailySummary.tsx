import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const API_BASE_URL = 'https://weather-monitoring-system-321u.onrender.com/api';

interface DailySummaryData {
  date: string;
  avgTemp: number;
  maxTemp: number;
  minTemp: number;
  dominantCondition: string;
}

interface DailySummaryProps {
  cities: string[];
  temperatureUnit: string;
}

const DailySummary = ({ cities, temperatureUnit }: DailySummaryProps) => {
  const [summaries, setSummaries] = useState<DailySummaryData[]>([]);
  const [selectedCity, setSelectedCity] = useState(cities[0]);

  useEffect(() => {
    fetchDailySummaries();
  }, [selectedCity]);

  const fetchDailySummaries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/daily-summary/${selectedCity}`);
      const data: DailySummaryData[] = await response.json();
      setSummaries(data);
    } catch (error) {
      console.error('Error fetching daily summaries:', error);
    }
  };

  const convertTemperature = (temp: number) => {
    return temperatureUnit === 'fahrenheit' ? (temp * 9/5) + 32 : temp;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Daily Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      {summaries.map((summary, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{summary.date}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>City: {selectedCity}</p>
            <p>Average Temperature: {convertTemperature(summary.avgTemp).toFixed(1)}°{temperatureUnit === 'celsius' ? 'C' : 'F'}</p>
            <p>Maximum Temperature: {convertTemperature(summary.maxTemp).toFixed(1)}°{temperatureUnit === 'celsius' ? 'C' : 'F'}</p>
            <p>Minimum Temperature: {convertTemperature(summary.minTemp).toFixed(1)}°{temperatureUnit === 'celsius' ? 'C' : 'F'}</p>
            <p>Dominant Condition: {summary.dominantCondition}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DailySummary;