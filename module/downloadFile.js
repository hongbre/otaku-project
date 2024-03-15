const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.downloadFile = async (fileUrl, downloadFolder, fileName) => {
  const localFilePath = path.resolve(__dirname, downloadFolder, fileName);

  try {
    const response = await axios({
      method: 'GET',
      url: fileUrl,
      responseType: 'stream'
    });

    const w = response.data.pipe(fs.createWriteStream(localFilePath));
    
    w.on('finish', () => {
      console.log(`Successfully downloaded file! ${fileName}`);
    });
  } catch (err) {
    throw new Error(err);
  }
};
