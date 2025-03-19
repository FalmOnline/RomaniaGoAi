// src/app/api/attractions/route.ts
// import { NextResponse } from 'next/server';

// const attractions = [
//   { id: 1, name: 'Bran Castle', description: 'A beautiful castle in Romania', imageUrl: '/images/bran-castle.jpg', location: 'Bran', lat: 45.5155, lng: 25.3675 },
//   { id: 2, name: 'Peles Castle', description: 'A stunning royal castle', imageUrl: '/images/peles-castle.jpg', location: 'Sinaia', lat: 45.3599, lng: 25.5424 },
// ];

// export async function GET() {
//   return NextResponse.json(attractions);
// }

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/attractions?populate=*`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return NextResponse.json(data.data);
  } catch (error) {
    console.error('Failed to fetch attractions:', error);
    return NextResponse.json({ error: 'Failed to fetch attractions' }, { status: 500 });
  }
}