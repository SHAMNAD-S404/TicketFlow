import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { config } from "../config";

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.cloudApiKey,
  api_secret: config.cloudApiSecret,
});

interface StorageParams {
  folder: string;
  format: string;
  allowedFormats: string[];
}

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, file) => {
    return {
      folder: "assetStore",
      format: file.originalname.split(".").pop()?.toLowerCase(),
      allowedFormats: ["jpeg", "png", "jpg", "gif"],
    } as StorageParams;
  },
});
