const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const FormData = require('form-data'); // Import FormData from the form-data package

const rollbarAccessToken = '5a7528a0778e412caba91bae0ca0ce95';
const sourceMapDirectory = path.join(process.cwd(), 'dist');

async function uploadSourceMaps() {
  try {
    const files = await fs.readdir(sourceMapDirectory);

    for (const file of files) {
      if (file.endsWith('.map')) {
        const sourceMapFilePath = path.join(sourceMapDirectory, file);
        const sourceMapContent = await fs.readFile(sourceMapFilePath, 'utf-8');

        // Create FormData and append the source map content
        const formData = new FormData();
        formData.append('version', '3.2');
        formData.append('access_token', rollbarAccessToken);
        formData.append('minified_url', `http://localhost:3000/${file.replace('.map', '')}`);
        formData.append('minified_file', file.replace('.map', ''));
        formData.append('source_map', sourceMapContent, { filename: file }); // No Blob needed

        // Send the request
        const response = await axios.post('https://api.rollbar.com/api/1/sourcemap', formData, {
          headers: {
            ...formData.getHeaders(),
            'Content-Type': 'multipart/form-data' // Ensure correct Content-Type
          }
        });

        console.log(`Uploaded ${file}:`, response.data);
      }
    }
  } catch (error) {
    console.error('Error uploading source maps:', error.response?.data || error.message);
  }
}

// Execute the function
uploadSourceMaps();
