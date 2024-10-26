import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const API_BASE_URL = 'http://localhost:3000/api';

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

interface AlertConfigData {
  city: string;
  threshold: number;
  email: string;
}

const AlertConfig = () => {
  const [selectedCity, setSelectedCity] = useState<string>('Delhi');
  const [alertThreshold, setAlertThreshold] = useState<number>(35);
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    fetchAlertConfig();
  }, []);

  const fetchAlertConfig = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/alert-config`);
      const data: AlertConfigData = await response.json();
      setSelectedCity(data.city || 'Delhi');
      setAlertThreshold(data.threshold || 35);
      setEmail(data.email || '');
    } catch (error) {
      console.error('Error fetching alert configuration:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/alert-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: selectedCity, threshold: alertThreshold, email }),
      });
      if (response.ok) {
        alert('Alert configuration updated successfully');
      } else {
        throw new Error('Failed to update alert configuration');
      }
    } catch (error) {
      console.error('Error updating alert configuration:', error);
      alert('Failed to update alert configuration');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger id="city">
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="alertThreshold">Alert Threshold (°C)</Label>
            <Input
              id="alertThreshold"
              type="number"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email for notifications"
            />
          </div>
          <Button type="submit">Update Alert Configuration</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AlertConfig;