/**
 * Image Processing Module
 *
 * Uploads images directly to Vercel Blob Storage.
 * No server-side processing needed - keeps it simple and reliable.
 */

import { put, del } from '@vercel/blob';

/**
 * Upload image to Vercel Blob Storage
 *
 * @param buffer - Image buffer from upload
 * @param filename - Desired filename (without extension)
 * @returns URL to saved image in Blob storage
 */
export async function processAndSaveImage(
  buffer: Buffer,
  filename: string
): Promise<string> {
  if (!buffer || buffer.length === 0) {
    throw new Error('Empty image buffer provided');
  }

  const finalFilename = `products/${filename}.jpg`;

  const blob = await put(finalFilename, buffer, {
    access: 'public',
    contentType: 'image/jpeg',
  });

  if (!blob || !blob.url) {
    throw new Error('Image upload failed - no URL returned');
  }

  return blob.url;
}

/**
 * Delete image file from Blob storage
 *
 * @param imageUrl - Full URL to the blob image
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return;

  // Only delete Vercel Blob URLs
  if (!imageUrl.includes('blob.vercel-storage.com')) {
    return;
  }

  try {
    await del(imageUrl);
  } catch (error) {
    console.warn('Failed to delete image:', imageUrl, error);
  }
}

/**
 * Validate image buffer - basic check without sharp
 *
 * @param buffer - Image buffer
 * @throws Error if image is invalid
 */
export async function validateImageBuffer(buffer: Buffer): Promise<void> {
  if (!buffer || buffer.length === 0) {
    throw new Error('Empty image buffer');
  }

  // Check magic bytes for JPEG, PNG, WebP
  const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8;
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  const isWebp = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;

  if (!isJpeg && !isPng && !isWebp) {
    throw new Error('Invalid image format. Please use JPEG, PNG, or WebP.');
  }
}
