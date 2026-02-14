/**
 * Image Upload API Route
 *
 * Endpoint:
 * - POST /api/upload - Upload and process image
 *
 * Accepts multipart/form-data with 'image' field
 * Returns processed image path
 */

import { NextRequest, NextResponse } from 'next/server';
import { processAndSaveImage, validateImageBuffer } from '@/lib/imageProcessor';
import { validateImageFile } from '@/lib/validation';
import type { ApiResponse, ApiError, ImageUploadResponse } from '@/types/api';

/**
 * POST /api/upload
 * Uploads and processes an image file
 */
export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'No file provided',
        },
        { status: 400 }
      );
    }

    // Validate file
    validateImageFile(file);

    // Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate image buffer
    await validateImageBuffer(buffer);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}`;

    // Process and save image
    const imagePath = await processAndSaveImage(buffer, filename);

    return NextResponse.json<ImageUploadResponse>(
      {
        success: true,
        data: {
          imagePath,
          originalName: file.name,
          size: file.size,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading image:', error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload image',
      },
      { status: 400 }
    );
  }
}
