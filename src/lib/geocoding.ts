import { City } from '@/types';

export async function searchCities(query: string): Promise<City[]> {
  if (!query || query.length < 2) return [];
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];
    return data.results.map((r: Record<string, unknown>) => ({
      id: `${r.latitude}-${r.longitude}`,
      name: r.name as string,
      country: r.country as string,
      latitude: r.latitude as number,
      longitude: r.longitude as number,
      timezone: r.timezone as string,
      population: r.population as number | undefined,
    }));
  } catch {
    return [];
  }
}
