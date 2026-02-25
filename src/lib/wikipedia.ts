import { WikiFact } from '@/types';

export async function fetchWikiFact(cityName: string): Promise<WikiFact | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.extract) return null;
    const sentences = data.extract.split('. ');
    const short = sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '.' : '');
    return {
      extract: short.length > 200 ? short.slice(0, 197) + '...' : short,
      url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(cityName)}`,
    };
  } catch {
    return null;
  }
}
