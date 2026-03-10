import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import "dotenv/config";
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "abEcommerce/images",
    allowedFormat: ["jpg", "jpeg", "png", "webp", "avif"],
    transformation: [
      { width: 800, height: 800, crop: "limit" },
      { fetch_format: "auto" },
      { quality: "auto" },
    ],
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const allowedMimeTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG,JPG,PNG,WEBP,AVIF"));
    }
  },
});

export function getPublicId(imageURL) {
  const parts = imageURL.split("/");
  const publicId = parts[parts.length - 1].split(".")[0];
  return publicId;
}

export async function deleteCloudinaryImages(imagesURL) {
  await Promise.all(
    imagesURL.map((imageUrl) =>
      cloudinary.uploader.destroy(getPublicId(imageUrl)),
    ),
  );
}
