// custom-api/index.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import OpenAI from "openai";
import { Pinecone } from '@pinecone-database/pinecone';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// Example route to fetch attractions from Strapi
app.get('/api/attractions', async (req, res) => {
  try {
    const response = await fetch(`${process.env.STRAPI_API_URL}/api/attractions?populate=*`, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    });
    const data = await response.json();
    res.json(data.data);
  } catch (error) {
    console.error('Error fetching attractions:', error);
    res.status(500).json({ error: 'Failed to fetch attractions' });
  }
});

// Example route to fetch events from Strapi
app.get('/api/events', async (req, res) => {
  try {
    const response = await fetch(`${process.env.STRAPI_API_URL}/api/events?populate=*`, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    });
    const data = await response.json();
    res.json(data.data);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Store vectors endpoint
// app.post('/api/store-vectors', async (req, res) => {
//   const { items } = req.body;
//   try {
//     const vectors = await Promise.all(items.map(async (item) => {
//       const response = await openai.embeddings.create({
//         model: 'text-embedding-ada-002',
//         input: item.description,
//       });
//       return {
//         id: item.id,
//         values: response.data[0].embedding,
//       };
//     }));
//     await pinecone.upsert({
//       indexName: 'your-index-name',
//       vectors,
//     });
//     res.json({ message: 'Vectors stored successfully' });
//   } catch (error) {
//     console.error('Error storing vectors:', error);
//     res.status(500).json({ error: 'Failed to store vectors' });
//   }
// });

// Search vectors endpoint
// app.post('/api/search-vectors', async (req, res) => {
//   const { query } = req.body;
//   try {
//     const response = await openai.embeddings.create({
//       model: 'text-embedding-ada-002',
//       input: query,
//     });
//     const queryVector = response.data[0].embedding;
//     const searchResults = await pinecone.query({
//       indexName: 'your-index-name',
//       queryVector,
//       topK: 10,
//     });
//     res.json(searchResults);
//   } catch (error) {
//     console.error('Error searching vectors:', error);
//     res.status(500).json({ error: 'Failed to search vectors' });
//   }
// });

// Recommendations endpoint
// app.post('/api/recommendations', async (req, res) => {
//   const { interests, location } = req.body;
//   try {
//     const prompt = `Based on the user's interests (${interests}) and location (${location}), recommend some attractions and events.`;
//     const response = await openai.createCompletion({
//       model: 'text-davinci-003',
//       prompt,
//       max_tokens: 150,
//     });
//     const recommendations = response.data.choices[0].text.trim();
//     res.json({ recommendations });
//   } catch (error) {
//     console.error('Error generating recommendations:', error);
//     res.status(500).json({ error: 'Failed to generate recommendations' });
//   }
// });

// Generate and store embeddings
app.post('/api/store-embeddings', async (req, res) => {
  try {
    const { items } = req.body; // items should be an array of attractions and events
    const vectors = await Promise.all(items.map(async (item) => {
      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: item.attributes.Description,
      });
      return {
        id: item.id.toString(),
        values: response.data[0].embedding,
      };
    }));
    await pinecone.upsert({
      indexName: 'your-index-name',
      vectors,
    });
    res.json({ message: 'Embeddings stored successfully' });
  } catch (error) {
    console.error('Error storing embeddings:', error);
    res.status(500).json({ error: 'Failed to store embeddings' });
  }
});

// Search embeddings
app.post('/api/search-embeddings', async (req, res) => {
  try {
    const { query } = req.body;
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query,
    });
    const queryVector = response.data[0].embedding;
    const searchResults = await pinecone.query({
      indexName: 'your-index-name',
      queryVector,
      topK: 10,
    });
    res.json(searchResults);
  } catch (error) {
    console.error('Error searching embeddings:', error);
    res.status(500).json({ error: 'Failed to search embeddings' });
  }
});

// Recommendations endpoint
app.post('/api/recommendations', async (req, res) => {
  const { interests, location } = req.body;
  try {
    // Fetch attractions and events
    const [attractionsResponse, eventsResponse] = await Promise.all([
      fetch(`${process.env.STRAPI_API_URL}/api/attractions?populate=*`, {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }),
      fetch(`${process.env.STRAPI_API_URL}/api/events?populate=*`, {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }),
    ]);

    const attractions = await attractionsResponse.json();
    const events = await eventsResponse.json();

    // Combine attractions and events data
    const combinedData = [...attractions.data, ...events.data];

    // Generate recommendations using OpenAI
    const prompt = `Based on the user's interests (${interests}) and location (${location}), recommend some attractions and events from the following list: ${combinedData.map(item => item.attributes.Name).join(', ')}.`;
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 150,
    });
    const recommendations = response.choices[0].text.trim();
    res.json({ recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});




// Geocoding endpoint
app.get('/api/geocode', async (req, res) => {
    const { address } = req.query;
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching geocode:', error);
      res.status(500).json({ error: 'Failed to fetch geocode' });
    }
  });
  
  // Distance calculation endpoint
  app.get('/api/distance', async (req, res) => {
    const { origins, destinations } = req.query;
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching distance:', error);
      res.status(500).json({ error: 'Failed to fetch distance' });
    }
  });



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});