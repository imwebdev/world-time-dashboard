import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'No API key configured' }, { status: 501 });
  }

  try {
    const { city, country, weather, isDay } = await req.json();
    const timeOfDay = isDay ? 'daytime, golden hour lighting' : 'nighttime, city lights glowing';
    const weatherDesc = weather || 'clear skies';

    const openai = new OpenAI({ apiKey });
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Stunning panoramic cityscape photograph of ${city}, ${country}. ${timeOfDay}, ${weatherDesc}. Ultra-wide cinematic composition, professional travel photography, vivid colors, dramatic sky, high resolution. No text, no watermarks, no people in foreground.`,
      n: 1,
      size: '1792x1024',
      quality: 'standard',
    });

    const url = response.data?.[0]?.url;
    if (!url) throw new Error('No image generated');
    return NextResponse.json({ url });
  } catch (err) {
    console.error('AI bg generation failed:', err);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
