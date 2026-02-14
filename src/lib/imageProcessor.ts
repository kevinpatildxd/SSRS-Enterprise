/**
 * Image Processing Module
 *
 * Handles image upload, compression, and optimization using Sharp.
 * Automatically resizes and optimizes images for web delivery.
 */

import sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';
import { IMAGE_CONFIG } from './constants';

/**
 * Process and save uploaded image
 *
 * @param buffer - Image buffer from upload
 * @param filename - Desired filename (without extension)
 * @returns Path to saved image (relative to /public)
 */
export async function processAndSaveImage(
  buffer: Buffer,
  filename: string
): Promise<string> {
  // Ensure images directory exists
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'products');
  await fs.mkdir(imagesDir, { recursive: true });

  // Process image with Sharp
  const processedImage = await sharp(buffer)
    .resize(IMAGE_CONFIG.MAX_WIDTH, IMAGE_CONFIG.MAX_HEIGHT, {
      fit: 'inside', // Maintain aspect ratio
      withoutEnlargement: true, // Don't upscale small images
    })
    .jpeg({ quality: IMAGE_CONFIG.QUALITY }) // Convert to JPEG and compress
    .toBuffer();

  // Generate unique filename
  const finalFilename = `${filename}.jpg`;
  const filePath = path.join(imagesDir, finalFilename);

  // Save to disk
  await fs.writeFile(filePath, processedImage);

  // Return path relative to /public
  return `/images/products/${finalFilename}`;
}

/**
 * Create thumbnail from image
 *
 * @param buffer - Original image buffer
 * @param filename - Desired filename (without extension)
 * @returns Path to thumbnail (relative to /public)
 */
export async function createThumbnail(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'products');
  await fs.mkdir(imagesDir, { recursive: true });

  const thumbnail = await sharp(buffer)
    .resize(IMAGE_CONFIG.THUMBNAIL_WIDTH, IMAGE_CONFIG.THUMBNAIL_WIDTH, {
      fit: 'cover', // Crop to square
    })
    .jpeg({ quality: IMAGE_CONFIG.QUALITY })
    .toBuffer();

  const finalFilename = `${filename}_thumb.jpg`;
  const filePath = path.join(imagesDir, finalFilename);

  await fs.writeFile(filePath, thumbnail);

  return `/images/products/${finalFilename}`;
}

/**
 * Delete image file
 *
 * @param imagePath - Path to image (relative to /public)
 */
export async function deleteImage(imagePath: string): Promise<void> {
  if (!imagePath) return;

  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    await fs.unlink(fullPath);
  } catch (error) {
    // Ignore errors (file might not exist)
    console.warn('Failed to delete image:', imagePath, error);
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
