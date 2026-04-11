
/**
 * Netlify Function: Load Parker's added schools from Google Drive
 * Reads from a JSON file stored in Google Drive (via service account)
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Service account credentials (from environment variable)
const getServiceAccount = () => {
  const creds = process.env.GOOGLE_SERVICE_ACCOUNT;
  if (!creds) {
    console.warn('GOOGLE_SERVICE_ACCOUNT not set');
    return null;
  }
  try {
    return JSON.parse(creds);
  } catch (err) {
    console.error('Failed to parse service account:', err);
    return null;
  }
};

const auth = new google.auth.GoogleAuth({
  credentials: getServiceAccount(),
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

exports.handler = async (event) => {
  try {
    // File ID in Google Drive (set this once after uploading the file)
    const FILE_ID = process.env.PARKER_SCHOOLS_FILE_ID;
    if (!FILE_ID) {
      return { statusCode: 200, body: JSON.stringify({ schools: [] }) };
    }

    // Download file from Google Drive
    const response = await drive.files.get(
      { fileId: FILE_ID, alt: 'media' },
      { responseType: 'stream' }
    );

    let fileContent = '';
    await new Promise((resolve, reject) => {
      response.data
        .on('data', (chunk) => { fileContent += chunk; })
        .on('end', resolve)
        .on('error', reject);
    });

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
      body: JSON.stringify({ schools: [] })
    };
  }
};
