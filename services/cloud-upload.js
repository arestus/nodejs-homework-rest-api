const cloudinary = require("cloudinary").v2;
const { promisify } = require("util");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadCloud = promisify(cloudinary.uploader.upload);

class UploadService {
  async saveAvatar(pathFile, idCloudAvatar) {
    const { public_id, secure_url } = await uploadCloud(pathFile, {
      public_id: idCloudAvatar?.replace("CloudAvatar/", ""),
      folder: "CloudAvatar",
      transformation: { width: 250, height: 250, crop: "pad" },
    });
    return { idCloudAvatar: public_id, avatarUrl: secure_url };
  }
}

module.exports = UploadService;
