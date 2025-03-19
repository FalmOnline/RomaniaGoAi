import { useState } from 'react';

const TripPlanner = () => {
  const [address, setAddress] = useState('');
  const [geocodeResult, setGeocodeResult] = useState(null);
  const [origins, setOrigins] = useState('');
  const [destinations, setDestinations] = useState('');
  const [distanceResult, setDistanceResult] = useState(null);

  const handleGeocode = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/geocode?address=${encodeURIComponent(address)}`);
      const data = await response.json();
      setGeocodeResult(data);
    } catch (error) {
      console.error('Failed to fetch geocode:', error);
    }
  };

  const handleDistance = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/distance?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}`);
      const data = await response.json();
      setDistanceResult(data);
    } catch (error) {
      console.error('Failed to fetch distance:', error);
    }
  };

  return (
    <div>
      <h2>Trip Planner</h2>
      <div>
        <h3>Geocode</h3>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter address" />
        <button onClick={handleGeocode}>Get Geocode</button>
        {geocodeResult && <pre>{JSON.stringify(geocodeResult, null, 2)}</pre>}
      </div>
      <div>
        <h3>Distance Calculation</h3>
        <input type="text" value={origins} onChange={(e) => setOrigins(e.target.value)} placeholder="Enter origins" />
        <input type="text" value={destinations} onChange={(e) => setDestinations(e.target.value)} placeholder="Enter destinations" />
        <button onClick={handleDistance}>Get Distance</button>
        {distanceResult && <pre>{JSON.stringify(distanceResult, null, 2)}</pre>}
      </div>
    </div>
  );
};

export default TripPlanner;