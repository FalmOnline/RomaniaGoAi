// "use client";

// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import MapComponent from './components/MapComponent';
// import EventCard from './components/EventCard';
// import TripPlanner from './components/TripPlanner';
// import Recommendations from './components/Recommendations';
// import SearchWithPreferences from './components/SearchWithPreferences';

// interface Attraction {
//   id: number;
//   attributes: {
//     Name: string;
//     Description: string;
//     latitude: number;
//     longitude: number;
//     address: string;
//     Image: {
//       data: {
//         attributes: {
//           url: string;
//         };
//       };
//     };
//   };
// }

// export default function Home() {
//   const [attractions, setAttractions] = useState<Attraction[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isError, setIsError] = useState(false);

//   useEffect(() => {
//     const fetchAttractions = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/attractions');
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         setAttractions(data);
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Failed to fetch attractions:', error);
//         setIsError(true);
//         setIsLoading(false);
//       }
//     };

//     fetchAttractions();
//   }, []);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (isError) {
//     return <div>Failed to load attractions</div>;
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       <div>
//       <Recommendations />
//       <SearchWithPreferences />
//      </div>
//       <div>
//         <MapComponent attractions={attractions} />
//         <TripPlanner />
//       </div>
//       {attractions.map((attraction) => (
//         <EventCard
//           key={attraction.id}
//           title={attraction.title}
//           description={attraction.Description}
//           // imageUrl={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${attraction.Image.url}`}
//           imageUrl={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${attraction.Image.url}`}
//           location={attraction.address}
//         />
//       ))}
//     </div>
//   );
// }

// Old GOOD PAGE

// import MapComponent from './components/MapComponent';
// import EventCard from './components/EventCard';
// import TripPlanner from './components/TripPlanner';
// import SearchWithPreferences from './components/SearchWithPreferences';
// import Link from 'next/link';
// import WelcomeBanner from './components/WelcomeBanner';

// interface Attraction {
//   id: number;
//   title: string;
//   slug: string;
//   shortDescription: string;
//   description: any; // probably an array of rich text blocks
//   latitude: number;
//   longitude: number;
//   address: string | null;
//   image: {
//     url: string;
//     formats?: {
//       small?: { url: string };
//       medium?: { url: string };
//       thumbnail?: { url: string };
//     };
//   };
// }

// async function fetchAttractions(): Promise<Attraction[]> {
//   try {
//     const response = await fetch('http://localhost:5000/api/attractions', {
//       cache: 'no-store', // Ensures fresh data on every request
//     });
//     if (!response.ok) {
//       throw new Error('Failed to fetch attractions');
//     }
//     const data = await response.json();
//     return data;

//   } catch (error) {
//     console.error('Error fetching attractions:', error);
//     return [];
//   }
// }

// export default async function Home() {
//   const attractions = await fetchAttractions();

//   return (
//     <div className="grid grid-cols-1 gap-4">
//       <div><WelcomeBanner /></div>
//       <div><SearchWithPreferences /></div>
//       <div>
//         {/* <Recommendations /> */}

//       </div>
//       <div>
//         <MapComponent attractions={attractions} />
//         <TripPlanner />

//       </div>
//       {attractions.map((attraction) => (
//         <EventCard
//           key={attraction.id}
//           title={attraction.title}
//           slug={attraction.slug}
//           shortDescription={attraction.shortDescription}
//           description={attraction.description.text}
//           imageUrl={
//             attraction.image?.formats?.medium?.url
//               ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${attraction.image.formats.medium.url}`
//               : attraction.image?.url
//                 ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${attraction.image.url}`
//                 : '/default-image.jpg'
//           }
//           location={attraction.address}
//         />
//       ))}
//     </div>
//   );
// }

//NEW CODE

// src/app/components/HomeClient.tsx

import { useEffect, useState } from "react";
import MapComponent from "./components/MapComponent";
import EventCard from "./components/EventCard";
import TripPlanner from "./components/TripPlanner";
import SearchBar from "./components/SearchBar";
import CollageGallery from "./components/CollageGallery";
import SearchResults from "./components/SearchResults";
import WelcomeBanner from "./components/WelcomeBanner";
import Hero from "./components/HomeSections/Hero";

interface Attraction {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  description: any;
  latitude: number;
  longitude: number;
  address: string | null;
  image: {
    url: string;
    formats?: {
      small?: { url: string };
      medium?: { url: string };
      thumbnail?: { url: string };
    };
  };
}

export default function HomeClient() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [query, setQuery] = useState("");
  const isSearching = query.length > 0;

  const mockEvents = [
    { title: "Sibiu Jazz Festival", imageUrl: "/events/jazz.jpg" },
    { title: "Transylvania Trail", imageUrl: "/events/trail.jpg" },
    { title: "Cluj Days", imageUrl: "/events/cluj.jpg" },
  ];

  const mockArticles = [
    { title: "Top 10 Castles to Visit", imageUrl: "/articles/castles.jpg" },
    { title: "Weekend Escapes", imageUrl: "/articles/weekend.jpg" },
    { title: "Romanian Nature Wonders", imageUrl: "/articles/nature.jpg" },
  ];

  useEffect(() => {
    async function fetchAttractions() {
      try {
        const response = await fetch("http://localhost:5000/api/attractions", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch attractions");
        }
        const data = await response.json();
        setAttractions(data);
      } catch (error) {
        console.error("Error fetching attractions:", error);
      }
    }

    fetchAttractions();
  }, []);

  const filteredResults = {
    attractions: attractions.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()),
    ),
    events: mockEvents.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()),
    ),
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <Hero />
      <div className="p-4 max-w-screen-lg mx-auto">
        <SearchBar query={query} setQuery={setQuery} />
        {!isSearching ? (
          <>
            <CollageGallery
              title="Explore Attractions"
              items={attractions.map((a) => ({
                title: a.title,
                imageUrl: a.image?.formats?.medium?.url
                  ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${a.image.formats.medium.url}`
                  : a.image?.url
                    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${a.image.url}`
                    : "/default-image.jpg",
              }))}
            />

            <CollageGallery title="Upcoming Events" items={mockEvents} />

            <CollageGallery
              title="Articles to Inspire You"
              items={mockArticles}
            />
          </>
        ) : (
          <SearchResults results={filteredResults} />
        )}
      </div>

      <div>
        <MapComponent attractions={attractions} />
        <TripPlanner />
      </div>
      {attractions.map((attraction) => (
        <EventCard
          key={attraction.id}
          title={attraction.title}
          slug={attraction.slug}
          shortDescription={attraction.shortDescription}
          description={
            Array.isArray(attraction.description)
              ? attraction.description
                  .map((block: any) =>
                    block.children.map((child: any) => child.text).join(" "),
                  )
                  .join("\n")
              : ""
          }
          imageUrl={
            attraction.image?.formats?.medium?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${attraction.image.formats.medium.url}`
              : attraction.image?.url
                ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${attraction.image.url}`
                : "/default-image.jpg"
          }
          location={attraction.address}
        />
      ))}
    </div>
  );
}
