const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function doesFileExistInKestra(kestraApiBaseUrl, kestraFilePath) {
  try {
    const directoryApiUrl = `${kestraApiBaseUrl}/directory`;
    const listResponse = await axios.get(directoryApiUrl);

    if (listResponse.status === 200 && Array.isArray(listResponse.data)) {
      return listResponse.data.some((file) => file.fileName === kestraFilePath);
    }
    return false;
  } catch (err) {
    throw new Error(err.response?.data || 'Failed to list files in Kestra namespace.');
  }
}

async function deleteFileFromKestra(kestraApiBaseUrl, kestraFilePath) {
  try {
    const deleteUrl = `${kestraApiBaseUrl}/${kestraFilePath}`;
    const deleteResponse = await axios.delete(deleteUrl);

    if (deleteResponse.status !== 204) {
      throw new Error(`Unexpected response during file deletion: ${deleteResponse.status}`);
    }
  } catch (err) {
    throw new Error(err.response?.data || `Failed to delete file ${kestraFilePath}`);
  }
}

async function uploadFileToKestra(kestraApiBaseUrl, kestraFilePath, localFilePath) {
  const formData = new FormData();
  formData.append('fileContent', fs.createReadStream(localFilePath));

  try {
    const uploadUrl = `${kestraApiBaseUrl}?path=${kestraFilePath}`;
    const uploadResponse = await axios.post(uploadUrl, formData, {
      headers: {
        ...formData.getHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });

    if (uploadResponse.status !== 200) {
      throw new Error(`Unexpected response during file upload: ${uploadResponse.status}`);
    }
  } catch (err) {
    throw new Error(err.response?.data || `Failed to upload file to Kestra: ${kestraFilePath}`);
  }
}

module.exports = {
  doesFileExistInKestra,
  deleteFileFromKestra,
  uploadFileToKestra,
};