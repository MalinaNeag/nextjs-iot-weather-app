import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

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
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    // Fetch data from the external API
    const response = await axios.get(url);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching pollution data:', error);
    return new Response('Error fetching pollution data', { status: 500 });
  }
}
