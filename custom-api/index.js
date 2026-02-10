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


function joinUrl(base, path) {
  if (!base) return path;
  if (!path) return path;
  const cleanBase = base.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

function absolutizeMaybe(url) {
  if (!url || typeof url !== "string") return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // Only Strapi upload paths should be absolutized
  if (url.startsWith("/uploads/")) {
    return joinUrl(process.env.STRAPI_PUBLIC_URL, url);
  }
  return url;
}

/**
 * Detect a Strapi media object by typical keys.
 * This avoids accidentally changing unrelated objects that happen to have `url`.
 */
function isStrapiMediaObject(obj) {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.url === "string" &&
    (obj.formats || obj.mime || obj.provider || obj.hash)
  );
}

console.log("STRAPI_PUBLIC_URL =", process.env.STRAPI_PUBLIC_URL);
/**
 * Recursively walk any object/array and absolutize every Strapi media `url`
 * (including formats.small.url, formats.medium.url, etc.)
 */
function absolutizeMediaDeep(value) {
  if (Array.isArray(value)) {
    return value.map(absolutizeMediaDeep);
  }

  if (value && typeof value === "object") {
    // If it's a Strapi media object, fix url + formats urls
    if (isStrapiMediaObject(value)) {
      const fixed = { ...value };
      fixed.url = absolutizeMaybe(fixed.url);

      if (fixed.formats && typeof fixed.formats === "object") {
        fixed.formats = { ...fixed.formats };
        for (const k of Object.keys(fixed.formats)) {
          fixed.formats[k] = { ...fixed.formats[k] };
          fixed.formats[k].url = absolutizeMaybe(fixed.formats[k].url);
        }
      }

      return fixed;
    }

    // Otherwise, just recurse into keys
    const out = { ...value };
    for (const key of Object.keys(out)) {
      out[key] = absolutizeMediaDeep(out[key]);
    }
    return out;
  }

  return value;
}

// Create reusable fetch from Strapi
async function fetchStrapiCollection(collectionName) {
  const url = `${process.env.STRAPI_API_URL}/api/${collectionName}?populate=*`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi failed: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  const items = json?.data ?? [];

  // Option 2: normalize media urls here
  return absolutizeMediaDeep(items);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

const pineconeIndex = pinecone.index("romaniago"); // Replace with your index name  


// Example route to fetch attractions from Strapi
app.get("/api/attractions", async (req, res) => {
  try {
    const items = await fetchStrapiCollection("attractions");
    res.json(items);
  } catch (error) {
    console.error("Error fetching attractions:", error);
    res.status(500).json({ error: "Failed to fetch attractions" });
  }
});

// Example route to fetch events from Strapi
app.get("/api/events", async (req, res) => {
  try {
    res.json(await fetchStrapiCollection("events"));
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Example route to fetch Destinations from Strapi
app.get("/api/destinations", async (req, res) => {
  try {
    res.json(await fetchStrapiCollection("destinations"));
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});


// Example route to fetch locations from Strapi
app.get("/api/locations", async (req, res) => {
  try {
    res.json(await fetchStrapiCollection("locations"));
  } catch (error) {
    console.error("Error fetching locations.", error);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// Example route to fetch Monuments from Strapi
app.get("/api/monuments", async (req, res) => {
  try {
    res.json(await fetchStrapiCollection("monuments"));
  } catch (error) {
    console.error("Error fetching monuments.", error);
    res.status(500).json({ error: "Failed to fetch monuments" });
  }
});


// Example route to fetch Articles from Strapi
app.get("/api/articles", async (req, res) => {
  try {
    res.json(await fetchStrapiCollection("articles"));
  } catch (error) {
    console.error("Error fetching articles.", error);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});


// This endpoint is used to work with SearcWithPrefferences
// Use the /api/store-embeddings endpoint to fetch data from Strapi, generate embeddings using OpenAI, and store them in Pinecone.

app.post('/api/update-embeddings', async (req, res) => {
  try {
    const dataTypes = ["attractions","destinations","events","locations","monuments", "articles"];
    let updatedVectors = [];

    for (const dataType of dataTypes) {

      // Fetch data from Strapi
      const response = await fetch(`${process.env.STRAPI_API_URL}/api/${dataType}?populate=*`, {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      });
      const data = await response.json();

   

      // Generate embeddings for each item
      const vectors = await Promise.all(
        data.data.map(async (item) => {


          // Combine title and description for embedding input
          const text = `${item.title || item.name || item.Title || ""} ${item.description || item.Description || ""}`.trim();


          // Skip items with no meaningful text
          if (!text) {
            console.warn(`Skipping item with ID ${item.id} due to missing title and description.`);
            return null;
          }

          const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: text,
          });


          // Extract relevant metadata

          function extractTextFromBlocks(blocks) {
            if (!Array.isArray(blocks)) return "";
          
            return blocks
              .map(block => {
                if (block.children && Array.isArray(block.children)) {
                  return block.children.map(child => child.text).join(" ");
                }
                return "";
              })
              .join(" ")
              .trim();
          }

          
          // const metadata = {
          //   title: item.title || item.Title || item.name || item.Name || "",
          //   description: typeof item.description === "string"
          //     ? item.description
          //     : extractTextFromBlocks(item.description),
          //   tags: Array.isArray(item.highlights)
          //     ? item.highlights
          //         .map((highlight) => {
          //           if (typeof highlight === "object" && typeof highlight.name === "string") {
          //             return highlight.name;
          //           }
          //           return null;
          //         })
          //         .filter((tag) => tag)
          //     : [],
          // };

          const metadata = {
            title: item.title || item.Title || item.name || item.Name || "",
            description: typeof item.description === "string"
              ? item.description
              : extractTextFromBlocks(item.description),
            tags: Array.isArray(item.highlights)
              ? item.highlights
                  .map((highlight) => {
                    if (typeof highlight === "object" && typeof highlight.name === "string") {
                      return highlight.name;
                    }
                    return null;
                  })
                  .filter((tag) => tag)
              : [],
            category: dataType, // e.g. 'attractions', 'events'
            link: `/${dataType}/${item.slug || item.id}`, // dynamic frontend route
          };
          


          return {
            id: `${dataType}-${item.id}`, // Unique ID
            values: embeddingResponse.data[0].embedding,
            metadata,
          };
        })
      );



      // Filter out null values (skipped items)
      updatedVectors = updatedVectors.concat(vectors.filter((vector) => vector !== null));
    }

    console.log("Sample vector metadata:", updatedVectors);

    if (!Array.isArray(updatedVectors)) {
      console.error("updatedVectors is not an array:", updatedVectors);
      return res.status(500).json({ error: "Internal server error: updatedVectors is not an array" });
    }

    // updatedVectors.forEach((vector, index) => {
    //   if (!vector.id || !Array.isArray(vector.values) || typeof vector.metadata !== "object") {
    //     console.error(`Invalid vector at index ${index}:`, vector);
    //   }
    // });

    updatedVectors.forEach((vector, index) => {
      if (!Array.isArray(vector.metadata.tags)) {
        console.warn(`Vector ${vector.id} has invalid tags`, vector.metadata.tags);
      } else if (vector.metadata.tags.some(tag => typeof tag !== 'string')) {
        console.warn(`Vector ${vector.id} has non-string tags`, vector.metadata.tags);
      }
    });

    // Upsert updated vectors into Pinecone
    if (updatedVectors.length > 0) {
      await pineconeIndex.upsert(updatedVectors);
    } else {
      console.warn("No vectors to upsert.");
    }

    res.json({ message: 'Embeddings updated successfully' });
  } catch (error) {
    console.error('Error updating embeddings:', error);
    res.status(500).json({ error: 'Failed to update embeddings' });
  }
});


//Use the /api/search-embeddings endpoint to query Pinecone for matches based on user input.

app.post('/api/search-embeddings', async (req, res) => {
  try {
    const { query } = req.body;

    // Generate embeddings using OpenAI
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query,
    });



    const queryVector = embeddingResponse.data[0].embedding;

    // Query Pinecone for matches
    const searchResults = await pineconeIndex.query({
      vector: queryVector,
      topK: 10,
      includeMetadata: true,
    });

    // Extract tags from the query
    const tags = query.split(" ").map((tag) => tag.trim());

    res.json({ matches: searchResults.matches, tags });
  } catch (error) {
    console.error('Error searching embeddings:', error);
    res.status(500).json({ error: 'Failed to search embeddings' });
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




// This is a code that will help me to test OpenAI


// (async () => {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini", // Use a supported model
//       store: true,
//       messages: [
//         { role: "user", content: "write a haiku about AI" },
//       ],
//     });

//     console.log("OpenAI Response:", completion.choices[0].message.content);
//   } catch (error) {
//     console.error("Error calling OpenAI API:", error.response?.data || error.message);
//   }
// })();


// Start the server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
