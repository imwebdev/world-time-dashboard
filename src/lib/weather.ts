import { WeatherData, WeatherCondition } from '@/types';

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day,wind_speed_10m,relative_humidity_2m&temperature_unit=fahrenheit`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      temperature: Math.round(data.current.temperature_2m),
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
      windSpeed: Math.round(data.current.wind_speed_10m),
      humidity: data.current.relative_humidity_2m,
    };
  } catch {
    return null;
  }
}

export function weatherCodeToCondition(code: number): WeatherCondition {
  if (code === 0 || code === 1) return 'clear';
  if (code === 2 || code === 3) return 'clouds';
  if (code >= 45 && code <= 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if (code >= 61 && code <= 67) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rain';
  if (code >= 85 && code <= 86) return 'snow';
  if (code >= 95 && code <= 99) return 'thunder';
  return 'clear';
}

export function weatherCodeToLabel(code: number): string {
  const map: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Rime fog',
    51: 'Light drizzle',
    53: 'Drizzle',
    55: 'Dense drizzle',
    56: 'Freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Rain',
    65: 'Heavy rain',
    66: 'Freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow',
    73: 'Snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight showers',
    81: 'Showers',
    82: 'Violent showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with heavy hail',
  };
  return map[code] || 'Unknown';
}

export function weatherCodeToIcon(code: number, isDay: boolean): string {
  const condition = weatherCodeToCondition(code);
  const icons: Record<WeatherCondition, string> = {
    clear: isDay ? '☀️' : '🌙',
    clouds: isDay ? '⛅' : '☁️',
    fog: '🌫️',
    drizzle: '🌦️',
    rain: '🌧️',
    snow: '🌨️',
    thunder: '⛈️',
  };
  return icons[condition];
}
