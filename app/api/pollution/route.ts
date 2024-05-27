// pages/api/pollution.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return new Response('Latitude and longitude are required', { status: 400 });
    }

    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const response = await axios.get(apiUrl);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching pollution data:', error);
    return new Response('Error fetching pollution data', { status: 500 });
  }
}
