/**
 * Image Upload API Route
 *
 * Endpoint:
 * - POST /api/upload - Upload and process image
 *
 * Features:
 * - Multipart form data handling
 * - File validation
 * - Image processing with Sharp
 * - Vercel Blob storage
 * - Comprehensive error handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { processAndSaveImage, validateImageBuffer } from '@/lib/imageProcessor';
import { validateImageFile } from '@/lib/validation';
import type { ApiResponse, ApiError, ImageUploadResponse } from '@/types/api';

/**
 * Maximum file size from environment or default (5MB)
 */
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10);

/**
 * POST /api/upload
 * Uploads and processes an image file
 */
export async function POST(request: NextRequest) {
  try {
    // Check content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Content-Type must be multipart/form-data',
        },
        { status: 400 }
      );
    }

    // Parse form data
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Failed to parse form data',
        },
        { status: 400 }
      );
    }

    // Get file from form data
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'No image file provided. Please upload an image.',
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!(file instanceof File)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Invalid file upload',
        },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Empty file uploaded',
        },
        { status: 400 }
      );
    }

    // Validate file type
    try {
      validateImageFile(file);
    } catch (validationError) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: validationError instanceof Error 
            ? validationError.message 
            : 'Invalid file type',
        },
        { status: 400 }
      );
    }

    // Convert to buffer
    let buffer: Buffer;
    try {
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    } catch {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Failed to read file data',
        },
        { status: 400 }
      );
    }

    // Validate image buffer
    try {
      await validateImageBuffer(buffer);
    } catch (validationError) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: validationError instanceof Error 
            ? validationError.message 
            : 'Invalid image file',
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const filename = `img_${timestamp}_${randomString}`;

    // Process and save image
    let imagePath: string;
    try {
      imagePath = await processAndSaveImage(buffer, filename);
    } catch (processError) {
      console.error('Image processing error:', processError);
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: processError instanceof Error 
            ? processError.message 
            : 'Failed to process image',
        },
        { status: 500 }
      );
    }

    // Success response
    return NextResponse.json<ImageUploadResponse>(
      {
        success: true,
        data: {
          imagePath,
          originalName: file.name,
          size: file.size,
        },
        message: 'Image uploaded successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in upload route:', error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: 'An unexpected error occurred while uploading the image',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/upload
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json<ApiResponse<{ status: string }>>({
    success: true,
    data: { status: 'upload endpoint ready' },
  });
}
