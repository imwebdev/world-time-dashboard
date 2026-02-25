import { SavedCity } from '@/types';

const CITIES_KEY = 'wtd_saved_cities';
const SELECTED_KEY = 'wtd_selected_city';

const DEFAULT_CITIES: SavedCity[] = [
  {
    id: '40.7128--74.006',
    name: 'New York',
    country: 'United States',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
    order: 0,
  },
  {
    id: '51.5074--0.1278',
    name: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
    order: 1,
  },
  {
    id: '35.6762-139.6503',
    name: 'Tokyo',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
    order: 2,
  },
  {
    id: '-36.8485-174.7633',
    name: 'Auckland',
    country: 'New Zealand',
    latitude: -36.8485,
    longitude: 174.7633,
    timezone: 'Pacific/Auckland',
    order: 3,
  },
  {
    id: '48.8566-2.3522',
    name: 'Paris',
    country: 'France',
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris',
    order: 4,
  },
];

export function getSavedCities(): SavedCity[] {
  if (typeof window === 'undefined') return DEFAULT_CITIES;
  try {
    const raw = localStorage.getItem(CITIES_KEY);
    if (!raw) {
      localStorage.setItem(CITIES_KEY, JSON.stringify(DEFAULT_CITIES));
      return DEFAULT_CITIES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CITIES;
  }
}

export function saveCities(cities: SavedCity[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CITIES_KEY, JSON.stringify(cities));
}

export function getSelectedCityId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SELECTED_KEY);
}

export function setSelectedCityId(id: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SELECTED_KEY, id);
}
