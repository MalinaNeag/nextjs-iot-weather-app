import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Extract search parameters from the request URL
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    // Validate the presence of latitude and longitude parameters
    if (!lat || !lon) {
      return new Response('Latitude and longitude are required', { status: 400 });
    }

    // Construct the API URL using the extracted parameters
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max,uv_index_clear_sky_max&timezone=auto&forecast_days=1`;

    // Fetch data from the external API
    const res = await fetch(url, {
      next: { revalidate: 900 },
    });

    if (!res.ok) {
      throw new Error('Error fetching UV data');
    }

    const uvData = await res.json();
    return NextResponse.json(uvData);
  } catch (error) {
    console.error('Error Getting UV Data', error);
    return new Response('Error getting UV data', { status: 500 });
  }
}
