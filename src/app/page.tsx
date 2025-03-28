"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import MapComponent from './components/MapComponent';
import EventCard from './components/EventCard';
import TripPlanner from './components/TripPlanner';
import Recommendations from './components/Recommendations';

interface Attraction {
  id: number;
  attributes: {
    Name: string;
    Description: string;
    latitude: number;
    longitude: number;
    address: string;
    Image: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

export default function Home() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/attractions');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAttractions(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch attractions:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchAttractions();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Failed to load attractions</div>;
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
      <Recommendations />
     </div>
      <div>
        <MapComponent attractions={attractions} />
        <TripPlanner />
      </div>
      {attractions.map((attraction) => (
        <EventCard
          key={attraction.id}
          title={attraction.title}
          description={attraction.Description}
          // imageUrl={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${attraction.Image.url}`}
          imageUrl={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${attraction.Image.url}`}
          location={attraction.address}
        />
      ))}
    </div>
  );
}