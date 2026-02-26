import { NextResponse } from 'next/server';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const APP_NAME = 'world_time_dashboard';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const country = searchParams.get('country');

  if (!city) {
    return NextResponse.json({ error: 'city parameter required' }, { status: 400 });
  }

  if (!UNSPLASH_ACCESS_KEY) {
    return NextResponse.json({ error: 'Unsplash API not configured' }, { status: 503 });
  }

  try {
    const query = `${city} ${country || ''} city skyline landmark`.trim();
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&content_filter=high`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Unsplash API error' }, { status: res.status });
    }

    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({ error: 'No photos found' }, { status: 404 });
    }

    const photo = data.results[0];

    // Trigger download tracking per Unsplash API ToC
    // This is required — it's an event endpoint, not an actual download
    fetch(`https://api.unsplash.com/photos/${photo.id}/download`, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    }).catch(() => {});

    return NextResponse.json({
      url: photo.urls.regular,
      photographer: {
        name: photo.user.name,
        username: photo.user.username,
        profileUrl: `https://unsplash.com/@${photo.user.username}?utm_source=${APP_NAME}&utm_medium=referral`,
      },
      unsplashUrl: `https://unsplash.com/?utm_source=${APP_NAME}&utm_medium=referral`,
      blurHash: photo.blur_hash,
      altDescription: photo.alt_description,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch from Unsplash' }, { status: 500 });
  }
}
