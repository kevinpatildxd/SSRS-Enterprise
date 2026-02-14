/**
 * Products API Route
 *
 * Endpoints:
 * - GET /api/products - Get all products
 * - POST /api/products - Create new product
 *
 * Features:
 * - Comprehensive error handling
 * - Input validation
 * - Structured JSON responses
 * - Proper HTTP status codes
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllProducts, createProduct, initializeSchema, testConnection } from '@/lib/db';
import { validateProductInput } from '@/lib/validation';
import type { ApiResponse, ApiError } from '@/types/api';
import type { Product } from '@/types/product';

/**
 * Handle errors in a consistent way
 */
function handleError(error: unknown, defaultMessage: string): NextResponse<ApiError> {
  const message = error instanceof Error ? error.message : defaultMessage;
  const status = message.includes('validation') || message.includes('required') ? 400 : 500;
  
  console.error(`API Error (${status}):`, error);
  
  return NextResponse.json<ApiError>(
    {
      success: false,
      error: message,
    },
    { status }
  );
}

/**
 * GET /api/products
 * Returns all products from database
 * 
 * Query params:
 * - init=true: Initialize database schema (development only)
 */
export async function GET(request: NextRequest) {
  try {
    // Check for init query param (for development)
    const { searchParams } = new URL(request.url);
    const shouldInit = searchParams.get('init') === 'true';
    
    if (shouldInit) {
      try {
        await initializeSchema();
        return NextResponse.json<ApiResponse<{ initialized: true }>>({
          success: true,
          data: { initialized: true },
          message: 'Database schema initialized',
        });
      } catch (initError) {
        return handleError(initError, 'Failed to initialize database');
      }
    }

    // Test database connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Database connection failed. Please check your configuration.',
        },
        { status: 503 }
      );
    }

    const products = await getAllProducts();

    return NextResponse.json<ApiResponse<Product[]>>({
      success: true,
      data: products,
      message: products.length === 0 ? 'No products found' : `Found ${products.length} products`,
    });
  } catch (error) {
    return handleError(error, 'Failed to fetch products');
  }
}

/**
 * POST /api/products
 * Creates a new product
 *
 * Body: { name, price, min_order_qty, image_path? }
 */
export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;
    
    // Parse request body
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Invalid JSON in request body',
        },
        { status: 400 }
      );
    }

    // Validate required fields exist
    if (!body.name || body.price === undefined) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Missing required fields: name and price are required',
        },
        { status: 400 }
      );
    }

    // Validate input
    const price = typeof body.price === 'string' ? parseFloat(body.price) : Number(body.price);
    
    if (isNaN(price) || price < 0) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Invalid price value',
        },
        { status: 400 }
      );
    }

    try {
      validateProductInput({
        name: body.name as string,
        price: price,
        min_order_qty: (body.min_order_qty as string) || '',
      });
    } catch (validationError) {
      return handleError(validationError, 'Validation failed');
    }

    // Create product
    const product = await createProduct({
      name: String(body.name).trim(),
      price: price,
      min_order_qty: String(body.min_order_qty || '').trim(),
      image_path: body.image_path ? String(body.image_path) : null,
    });

    // Revalidate home page cache so new product shows immediately
    revalidatePath('/');

    return NextResponse.json<ApiResponse<Product>>(
      {
        success: true,
        data: product,
        message: 'Product created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, 'Failed to create product');
  }
}

/**
 * Health check endpoint
 * Returns database status
 */
export async function HEAD() {
  try {
    const isConnected = await testConnection();
    
    return new NextResponse(null, {
      status: isConnected ? 200 : 503,
      headers: {
        'X-Database-Status': isConnected ? 'connected' : 'disconnected',
      },
    });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
