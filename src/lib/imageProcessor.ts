/**
 * Image Processing Module
 *
 * Handles image upload, compression, and optimization using Sharp.
 * Uploads to Vercel Blob Storage for serverless compatibility.
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
      fit: 'inside', // Maintain aspect ratio
      withoutEnlargement: true, // Don't upscale small images
    })
    .jpeg({ quality: IMAGE_CONFIG.QUALITY }) // Convert to JPEG and compress
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
 * Create thumbnail from image
 *
 * @param buffer - Original image buffer
 * @param filename - Desired filename (without extension)
 * @returns URL to thumbnail in Blob storage
 */
export async function createThumbnail(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const thumbnail = await sharp(buffer)
    .resize(IMAGE_CONFIG.THUMBNAIL_WIDTH, IMAGE_CONFIG.THUMBNAIL_WIDTH, {
      fit: 'cover', // Crop to square
    })
    .jpeg({ quality: IMAGE_CONFIG.QUALITY })
    .toBuffer();

  const finalFilename = `products/${filename}_thumb.jpg`;

  const blob = await put(finalFilename, thumbnail, {
    access: 'public',
    contentType: 'image/jpeg',
  });

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
    // Vercel Blob URLs have the format: https://[hash].public.blob.vercel-storage.com/...
    // We can delete using the full URL
    await del(imageUrl);
  } catch (error) {
    // Ignore errors (file might not exist or already deleted)
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
