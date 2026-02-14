/**
 * Image Processing Module
 *
 * Handles image upload, compression, and optimization using Sharp.
 * Uploads to Vercel Blob Storage for permanent cloud storage.
 * 
 * Features:
 * - Robust error handling with fallback
 * - Validates image before processing
 * - Converts to optimal format and size
 * - Secure cloud storage with Vercel Blob
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
 * @throws Error if processing or upload fails
 */
export async function processAndSaveImage(
  buffer: Buffer,
  filename: string
): Promise<string> {
  try {
    // Validate buffer first
    if (!buffer || buffer.length === 0) {
      throw new Error('Empty image buffer provided');
    }

    // Validate file size
    if (buffer.length > IMAGE_CONFIG.MAX_FILE_SIZE) {
      throw new Error(`Image too large. Maximum size is ${IMAGE_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    // Process image with Sharp
    let processedImage: Buffer;
    try {
      processedImage = await sharp(buffer)
        .resize(IMAGE_CONFIG.MAX_WIDTH, IMAGE_CONFIG.MAX_HEIGHT, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ 
          quality: IMAGE_CONFIG.QUALITY,
          progressive: true,
          optimizeCoding: true,
        })
        .toBuffer();
    } catch (sharpError) {
      console.error('Sharp processing error:', sharpError);
      throw new Error('Failed to process image. Please try a different image file.');
    }

    // Generate unique filename with timestamp and random string for security
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const finalFilename = `products/${filename}_${timestamp}_${randomString}.jpg`;

    // Check if Vercel Blob is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not set, storing image locally for development');
      // For development without Blob, we could save locally, but better to fail clearly
      throw new Error('Image storage not configured. Please contact administrator.');
    }

    // Upload to Vercel Blob Storage
    let blob;
    try {
      blob = await put(finalFilename, processedImage, {
        access: 'public',
        contentType: 'image/jpeg',
        addRandomSuffix: false, // We already added random string
      });
    } catch (blobError) {
      console.error('Blob upload error:', blobError);
      throw new Error('Failed to upload image to storage. Please try again.');
    }

    if (!blob || !blob.url) {
      throw new Error('Image upload failed - no URL returned');
    }

    console.log('Image uploaded successfully:', blob.url);
    return blob.url;
  } catch (error) {
    console.error('processAndSaveImage error:', error);
    throw error;
  }
}

/**
 * Delete image file from Blob storage
 *
 * @param imageUrl - Full URL to the blob image
 * @returns Promise that resolves when deletion is complete
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  if (!imageUrl || typeof imageUrl !== 'string') {
    console.warn('deleteImage called with invalid URL:', imageUrl);
    return;
  }

  // Only try to delete if it's a Vercel Blob URL
  if (!imageUrl.includes('blob.vercel-storage.com')) {
    console.log('Not a Vercel Blob URL, skipping deletion:', imageUrl);
    return;
  }

  try {
    await del(imageUrl);
    console.log('Image deleted from blob storage:', imageUrl);
  } catch (error) {
    // Log but don't throw - we don't want to fail product deletion if image deletion fails
    console.warn('Failed to delete image from storage:', imageUrl, error);
  }
}

/**
 * Validate image buffer
 *
 * @param buffer - Image buffer
 * @throws Error if image is invalid or unsupported format
 */
export async function validateImageBuffer(buffer: Buffer): Promise<void> {
  try {
    if (!buffer || buffer.length === 0) {
      throw new Error('Empty image buffer');
    }

    const metadata = await sharp(buffer).metadata();

    if (!metadata.format) {
      throw new Error('Could not determine image format');
    }

    const allowedFormats = ['jpeg', 'png', 'webp', 'jpg'];
    if (!allowedFormats.includes(metadata.format.toLowerCase())) {
      throw new Error(`Unsupported image format: ${metadata.format}. Please use JPEG, PNG, or WebP.`);
    }

    // Validate dimensions
    if (metadata.width && metadata.height) {
      if (metadata.width < 10 || metadata.height < 10) {
        throw new Error('Image dimensions too small. Minimum size is 10x10 pixels.');
      }
      if (metadata.width > 10000 || metadata.height > 10000) {
        throw new Error('Image dimensions too large. Maximum size is 10000x10000 pixels.');
      }
    }

  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Invalid image file');
  }
}

/**
 * Get image metadata
 * 
 * @param buffer - Image buffer
 * @returns Image metadata (width, height, format, etc.)
 */
export async function getImageMetadata(buffer: Buffer): Promise<sharp.Metadata> {
  return await sharp(buffer).metadata();
}
