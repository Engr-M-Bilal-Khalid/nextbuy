// lib/uploadToCloudinary.ts
import cloudinary from "./cloudinary";
import { UploadApiOptions, UploadApiResponse } from "cloudinary";

export function uploadBufferToCloudinary(
  buffer: Buffer,
  options: UploadApiOptions = {}
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result!);
    });
    stream.end(buffer);
  });
}

export async function uploadFileToCloudinary(
  file: File,
  options: UploadApiOptions = {}
) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return uploadBufferToCloudinary(buffer, {
    folder: "products/variants",
    resource_type: "image",
    ...options,
  });
}
