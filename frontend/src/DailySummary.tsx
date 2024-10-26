import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const API_BASE_URL = 'https://weather-monitoring-system-321u.onrender.com/api';

interface DailySummaryData {
  date: string;
  avgTemp: number;
  maxTemp: number;
  minTemp: number;
  dominantCondition: string;
}

interface DailySummaryProps {
  city: string;
  temperatureUnit: string;
}

const DailySummary = ({ city, temperatureUnit }: DailySummaryProps) => {
  const [summaries, setSummaries] = useState<DailySummaryData[]>([]);

  useEffect(() => {
    fetchDailySummaries();
  }, [city]);

  const fetchDailySummaries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/daily-summary/${city}`);
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
      {summaries.map((summary, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{summary.date}</CardTitle>
          </CardHeader>
          <CardContent>
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