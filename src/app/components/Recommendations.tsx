// import { useState } from 'react';

// const Recommendations = () => {
//   const [interests, setInterests] = useState('');
//   const [location, setLocation] = useState('');
//   const [recommendations, setRecommendations] = useState('');

//   const handleRecommendations = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/recommendations', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ interests, location }),
//       });
//       const data = await response.json();
//       setRecommendations(data.recommendations);
//     } catch (error) {
//       console.error('Failed to fetch recommendations:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Get Recommendations</h2>
//       <div>
//         <input
//           type="text"
//           value={interests}
//           onChange={(e) => setInterests(e.target.value)}
//           placeholder="Enter your interests"
//         />
//         <input
//           type="text"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//           placeholder="Enter your location"
//         />
//         <button onClick={handleRecommendations}>Get Recommendations</button>
//         {recommendations && <pre>{recommendations}</pre>}
//       </div>
//     </div>
//   );
// };

// export default Recommendations;


"use client";

import { useState } from 'react';

const Recommendations = () => {
  const [interests, setInterests] = useState('');
  const [location, setLocation] = useState('');
  const [recommendations, setRecommendations] = useState('');

  const handleRecommendations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interests, location }),
      });
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    }
  };

  return (
    <div>
      <h2>Get Recommendations</h2>
      <div>
        <input
          type="text"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="Enter your interests"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter your location"
        />
        <button onClick={handleRecommendations}>Get Recommendations</button>
        {recommendations && <pre>{recommendations}</pre>}
      </div>
    </div>
  );
};

export default Recommendations;