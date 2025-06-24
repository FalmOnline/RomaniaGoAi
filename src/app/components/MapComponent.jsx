"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import Image from 'next/image';
import Link from 'next/link';

const mapStyles = [
  {
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }]
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }]
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }]
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#f5f5f5" }]
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: "#bdbdbd" }]
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#eeeeee" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#e5e5e5" }]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }]
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#dadada" }]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }]
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c9c9c9" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }]
  }
];


const MapComponent = ({ attractions }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [userLocation, setUserLocation] = useState(null);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );
  }, []);

  const onMapLoad = useCallback((map) => {
    setMapRef(map);
    if (attractions.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      attractions.forEach((attraction) => {
        const { latitude, longitude } = attraction;
        if (
            typeof latitude === 'number' &&
            typeof longitude === 'number' &&
            !isNaN(latitude) &&
            !isNaN(longitude)
          ) {
            bounds.extend({ lat: latitude, lng: longitude });
          }
      });
      map.fitBounds(bounds);
    }
  }, [attractions]);

  if (!isLoaded) return <div>Loading...</div>;

  const containerStyle = {
    width: '100%',
    height: '500px',
  };

  const center = userLocation || { lat: 44.4268, lng: 26.1025 }; // Default center (e.g., Bucharest)

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={6}
      options={{
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
      }}
      onLoad={onMapLoad}
    >
      {userLocation && (
        <Marker
          position={userLocation}
          title="You are here"
          icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        />
      )}

      {attractions
        .filter(
          (attraction) =>
            typeof attraction.latitude === 'number' &&
            typeof attraction.longitude === 'number' &&
            !isNaN(attraction.latitude) &&
            !isNaN(attraction.longitude)
        )
        .map((attraction) => (
          <Marker
            key={attraction.id}
            position={{ lat: attraction.latitude, lng: attraction.longitude }}
            title={attraction.title}
            onClick={() => setSelectedAttraction(attraction)}
          />
        ))}

      {selectedAttraction && (
        <InfoWindow
          position={{ lat: selectedAttraction.latitude, lng: selectedAttraction.longitude }}
          onCloseClick={() => setSelectedAttraction(null)}
        >
          <div style={{ maxWidth: '200px' }}>
            {selectedAttraction.image && (
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${selectedAttraction.image.url}`}
                alt={selectedAttraction.title}
                width={200}
                height={120}
                style={{ borderRadius: '8px', marginTop: '8px' }}
              />
            )}
            <h3>{selectedAttraction.title}</h3>
            <p>{selectedAttraction.shortDescription}</p>
            <p><Link href={`/attractions/${selectedAttraction.slug}`}>Read more</Link></p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MapComponent;


