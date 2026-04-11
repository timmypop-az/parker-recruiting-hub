/**
 * Netlify Function: Load Parker's added schools from Google Drive
 * Uses Google Drive API with service account (no extra dependencies)
 */

const { GoogleAuth } = require('google-auth-library');

exports.handler = async (event) => {
  try {
    const FILE_ID = process.env.PARKER_SCHOOLS_FILE_ID;
    if (!FILE_ID) {
      return { 
        statusCode: 200, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schools: [] }) 
      };
    }

    const creds = process.env.GOOGLE_SERVICE_ACCOUNT;
    if (!creds) {
      return { 
        statusCode: 200, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schools: [] }) 
      };
    }

    const serviceAccount = JSON.parse(creds);
    
    // Get access token
    const auth = new GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    // Download file from Google Drive
    const url = `https://www.googleapis.com/drive/v3/files/${FILE_ID}?alt=media`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken.token}` },
    });

    if (!response.ok) {
      console.warn('Failed to fetch from Drive:', response.status);
      return { 
        statusCode: 200, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schools: [] }) 
      };
    }

    const fileContent = await response.text();
    const schools = JSON.parse(fileContent);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schools })
    };
  } catch (err) {
    console.error('Error loading schools from Drive:', err);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schools: [] })
    };
  }
};
