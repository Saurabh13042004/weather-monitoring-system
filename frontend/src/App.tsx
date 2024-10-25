'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Sun, CloudRain, Snowflake } from 'lucide-react'
import WeatherChart from './weather-chart'
import AlertsLog from './alerts-log'
import Instructions from './instructions'

// Demo data to simulate API responses
const generateDemoData = () => {
  const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad']
  const weatherConditions = ['Clear', 'Rain', 'Clouds', 'Snow']
  const data = {}

  cities.forEach(city => {
    data[city] = Array.from({ length: 24 }, (_, i) => ({
      main: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
      temp: 273.15 + Math.random() * 30, // Random temperature between 0°C and 30°C
      feels_like: 273.15 + Math.random() * 30,
      dt: Math.floor(Date.now() / 1000) - (23 - i) * 3600 // Last 24 hours
    }))
  })

  return data
}

const kelvinToCelsius = (kelvin: number) => Math.round(kelvin - 273.15)
const celsiusToFahrenheit = (celsius: number) => Math.round((celsius * 9/5) + 32)

export default function WeatherMonitoringSystem() {
  const [selectedCity, setSelectedCity] = useState('Delhi')
  const [temperatureUnit, setTemperatureUnit] = useState('celsius')
  const [updateInterval, setUpdateInterval] = useState(5)
  const [alertThreshold, setAlertThreshold] = useState(35)
  const [weatherData, setWeatherData] = useState(generateDemoData())
  const [alerts, setAlerts] = useState<string[]>([])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setWeatherData(prevData => {
        const newData = { ...prevData }
        Object.keys(newData).forEach(city => {
          const lastEntry = newData[city][newData[city].length - 1]
          newData[city].push({
            ...lastEntry,
            temp: lastEntry.temp + (Math.random() - 0.5) * 2,
            feels_like: lastEntry.feels_like + (Math.random() - 0.5) * 2,
            dt: Math.floor(Date.now() / 1000)
          })
          newData[city].shift() // Remove the oldest entry
        })
        return newData
      })

      // Check for alerts
      const currentTemp = kelvinToCelsius(weatherData[selectedCity][weatherData[selectedCity].length - 1].temp)
      if (currentTemp > alertThreshold) {
        setAlerts(prev => [...prev, `Alert: Temperature in ${selectedCity} exceeded ${alertThreshold}°C at ${new Date().toLocaleTimeString()}`])
      }
    }, updateInterval * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [updateInterval, alertThreshold, selectedCity, weatherData])

  const currentWeather = weatherData[selectedCity][weatherData[selectedCity].length - 1]
  const temperature = temperatureUnit === 'celsius' ? 
    kelvinToCelsius(currentWeather.temp) : 
    celsiusToFahrenheit(kelvinToCelsius(currentWeather.temp))

  const feelsLike = temperatureUnit === 'celsius' ? 
    kelvinToCelsius(currentWeather.feels_like) : 
    celsiusToFahrenheit(kelvinToCelsius(currentWeather.feels_like))

  return (
    <div className="container mx-auto p-14">
      <h1 className="text-3xl font-bold mb-4">Weather Monitoring System</h1>
      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger value="current">Current Weather</TabsTrigger>
          <TabsTrigger value="summary">Daily Summary</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle>Current Weather in {selectedCity}</CardTitle>
              <CardDescription>Last updated: {new Date(currentWeather.dt * 1000).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold">{temperature}°{temperatureUnit === 'celsius' ? 'C' : 'F'}</p>
                  <p>Feels like: {feelsLike}°{temperatureUnit === 'celsius' ? 'C' : 'F'}</p>
                  <p>Condition: {currentWeather.main}</p>
                </div>
                <div className="text-6xl">
                  {currentWeather.main === 'Clear' && <Sun />}
                  {currentWeather.main === 'Rain' && <CloudRain />}
                  {currentWeather.main === 'Snow' && <Snowflake />}
                  {!['Clear', 'Rain', 'Snow'].includes(currentWeather.main) && <AlertCircle />}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="summary">
          <WeatherChart data={weatherData[selectedCity]} city={selectedCity} unit={temperatureUnit} />
        </TabsContent>
        <TabsContent value="alerts">
          <AlertsLog alerts={alerts} />
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger id="city">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(weatherData).map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="unit">Temperature Unit</Label>
                <Select value={temperatureUnit} onValueChange={setTemperatureUnit}>
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celsius">Celsius</SelectItem>
                    <SelectItem value="fahrenheit">Fahrenheit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="interval">Update Interval (minutes)</Label>
                <Input 
                  id="interval" 
                  type="number" 
                  value={updateInterval} 
                  onChange={e => setUpdateInterval(Number(e.target.value))} 
                  min={1}
                />
              </div>
              <div>
                <Label htmlFor="threshold">Alert Threshold (°C)</Label>
                <Input 
                  id="threshold" 
                  type="number" 
                  value={alertThreshold} 
                  onChange={e => setAlertThreshold(Number(e.target.value))} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="mt-4">
      <Instructions />
      </div>
    </div>
  )
}