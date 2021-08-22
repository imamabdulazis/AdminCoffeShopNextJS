/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */

// const { format } = require('util');
const { Storage } = require("@google-cloud/storage");
const config = require("@utils/firebase");
const { v4: uuid } = require("uuid");

const storage = new Storage({
  projectId: config.projectId,
  keyFilename: "./src/helper/service_account.json",
});

const bucket = storage.bucket(config.storageBucket);

const uploadImageToStorage = (file) => {
    
  return new Promise((resolve, reject) => {
    let generatedToken = uuid();
    if (!file) {
      reject("No image file");
    }

    let newFileName = `${file.originalname}`;

    let fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.type,
      },
    });

    blobStream.on("error", (error) => {
      console.log(error);
      reject("Something is wrong! Unable to upload at the moment.");
    });

    blobStream.on("finish", (response) => {
      // const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
      const url = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${fileUpload.name}?alt=media&token=${generatedToken}`;
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
};

module.exports = { uploadImageToStorage };
