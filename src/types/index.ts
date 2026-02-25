export interface City {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  population?: number;
}

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  windSpeed: number;
  humidity: number;
}

export interface WikiFact {
  extract: string;
  url: string;
}

export type WeatherCondition = 'clear' | 'clouds' | 'rain' | 'snow' | 'thunder' | 'fog' | 'drizzle';

export interface SavedCity extends City {
  order: number;
}
