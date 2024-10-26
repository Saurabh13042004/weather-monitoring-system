import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, CloudRain, Cloud, Snowflake, Wind, Droplet, AlertCircle } from 'lucide-react'

interface WeatherData {
  [city: string]: {
    temp: number;
    feels_like: number;
    main: string;
    humidity: number;
    wind_speed: number;
  };
}

interface WeatherCarouselProps {
  weatherData: WeatherData;
  temperatureUnit: string;
}

const WeatherCarousel = ({ weatherData, temperatureUnit }: WeatherCarouselProps) => {
  const cities = Object.keys(weatherData);

  const convertTemperature = (temp: number) => {
    return temperatureUnit === 'fahrenheit' ? (temp * 9/5) + 32 : temp;
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="h-8 w-8 text-yellow-400" />;
      case 'rain':
        return <CloudRain className="h-8 w-8 text-blue-400" />;
      case 'clouds':
        return <Cloud className="h-8 w-8 text-gray-400" />;
      case 'snow':
        return <Snowflake className="h-8 w-8 text-blue-200" />;
      case 'haze':
      case 'mist':
      case 'fog':
        return <Wind className="h-8 w-8 text-gray-300" />;
      default:
        return <AlertCircle className="h-8 w-8 text-red-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cities.map((city) => {
        const data = weatherData[city];
        return (
          <Card key={city} className="w-full">
            <CardHeader>
              <CardTitle>{city}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{convertTemperature(data.temp).toFixed(1)}°{temperatureUnit === 'celsius' ? 'C' : 'F'}</p>
                  <p>Feels like: {convertTemperature(data.feels_like).toFixed(1)}°{temperatureUnit === 'celsius' ? 'C' : 'F'}</p>
                  <p className="flex items-center"><Droplet className="h-4 w-4 mr-1" /> {data.humidity}%</p>
                  <p className="flex items-center"><Wind className="h-4 w-4 mr-1" /> {data.wind_speed} m/s</p>
                </div>
                <div className="text-4xl">
                  {getWeatherIcon(data.main)}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">{data.main}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default WeatherCarousel;