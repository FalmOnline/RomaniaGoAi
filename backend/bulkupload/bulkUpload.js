(async () => {
  const fetch = (await import('node-fetch')).default;
  const fs = require('fs');
  const path = require('path');
  require('dotenv').config();

  const STRAPI_API_URL = process.env.STRAPI_API_URL;
  const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

  const uploadData = async () => {
    try {
      // Fetch tags data
      const tagsResponse = await fetch(`${STRAPI_API_URL}/api/tags`, {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`
        }
      });

      if (!tagsResponse.ok) {
        const errorText = await tagsResponse.text();
        throw new Error(`Failed to fetch tags. Response: ${tagsResponse.status} ${tagsResponse.statusText}. ${errorText}`);
      }

      const tagsData = await tagsResponse.json();
      console.log('Tags Data:', tagsData);

      // Create a mapping of tag names to their IDs
      const tagMap = {};
      tagsData.data.forEach(tag => {
        tagMap[tag.Name] = tag.id;
      });
      console.log('Tag Map:', tagMap);

      // Read regions data from JSON file
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'regions.json'), 'utf-8'));

      for (const item of data) {
        // Map tag names to tag IDs
        const tagIds = item.highlights.map(tagName => {
          if (tagMap[tagName]) {
            return tagMap[tagName];
          } else {
            throw new Error(`Tag not found: ${tagName}`);
          }
        });

        // Prepare the region data
        const regionData = {
          Title: item.Title,
          Description: item.Description,
          highlights: tagIds // Use the correct field name for the relationship
        };

        // Add image if it exists
        // if (item.image) {
        //   regionData.image = item.image;
        // }

        // Upload the region data
        console.log(`Uploading region: ${item.Title}`);
        console.log('Region Data:', regionData);
        const response = await fetch(`${STRAPI_API_URL}/api/regions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${STRAPI_API_TOKEN}`
          },
          body: JSON.stringify({ data: regionData })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to upload region: ${item.Title}. Response: ${response.status} ${response.statusText}. ${errorText}`);
        }

        const result = await response.json();
        console.log(`Uploaded: ${result.data.Title}`);
      }

      console.log('Bulk upload completed successfully.');
    } catch (error) {
      console.error('Error during bulk upload:', error);
    }
  };

  await uploadData();
})();


