/**
 * Image Processing Module
 *
 * Handles image upload, compression, and optimization using Sharp.
 * Uploads to Vercel Blob Storage for permanent cloud storage.
 */

import sharp from 'sharp';
import { put, del } from '@vercel/blob';
import { IMAGE_CONFIG } from './constants';

/**
 * Process and save uploaded image to Vercel Blob Storage
 *
 * @param buffer - Image buffer from upload
 * @param filename - Desired filename (without extension)
 * @returns URL to saved image in Blob storage
 */
export async function processAndSaveImage(
  buffer: Buffer,
  filename: string
): Promise<string> {
  // Process image with Sharp
  const processedImage = await sharp(buffer)
    .resize(IMAGE_CONFIG.MAX_WIDTH, IMAGE_CONFIG.MAX_HEIGHT, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: IMAGE_CONFIG.QUALITY })
    .toBuffer();

  // Generate unique filename
  const finalFilename = `products/${filename}.jpg`;

  // Upload to Vercel Blob Storage
  const blob = await put(finalFilename, processedImage, {
    access: 'public',
    contentType: 'image/jpeg',
  });

  // Return the blob URL
  return blob.url;
}

/**
 * Delete image file from Blob storage
 *
 * @param imageUrl - Full URL to the blob image
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return;

  try {
    // Delete from Vercel Blob using the full URL
    await del(imageUrl);
    console.log('Image deleted from blob storage:', imageUrl);
  } catch (error) {
    console.warn('Failed to delete image:', imageUrl, error);
  }
}

/**
 * Validate image buffer
 *
 * @param buffer - Image buffer
 * @throws Error if image is invalid
 */
export async function validateImageBuffer(buffer: Buffer): Promise<void> {
  try {
    const metadata = await sharp(buffer).metadata();

    if (!metadata.format || !['jpeg', 'png', 'webp'].includes(metadata.format)) {
      throw new Error('Invalid image format');
    }
  } catch (error) {
    throw new Error('Invalid image file');
  }
}
