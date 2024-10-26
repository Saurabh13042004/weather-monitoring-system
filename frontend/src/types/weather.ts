export interface WeatherData {
    [city: string]: {
      temp: number;
      feels_like: number;
      main: string;
      dt: number;
    };
  }
  
  export interface DailySummary {
    city: string;
    date: string;
    temperatures: number[];
    weatherConditions: string[];
    avgTemp: number;
    maxTemp: number;
    minTemp: number;
    dominantCondition: string;
  }
  
  export interface Alert {
    message: string;
    city: string;
    temperature: number;
    threshold: number;
    timestamp: Date;
  }
  
  export interface Config {
    updateInterval: number;
    alertThreshold: number;
  }
  