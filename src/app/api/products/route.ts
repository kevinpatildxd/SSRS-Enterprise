/**
 * Products API Route
 *
 * Endpoints:
 * - GET /api/products - Get all products
 * - POST /api/products - Create new product
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/db';
import { validateProductInput } from '@/lib/validation';
import type { ApiResponse, ApiError } from '@/types/api';
import type { Product } from '@/types/product';

/**
 * GET /api/products
 * Returns all products from database
 */
export async function GET(request: NextRequest) {
  try {
    const products = getAllProducts();

    return NextResponse.json<ApiResponse<Product[]>>({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
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
    // Parse request body
    const body = await request.json();

    // Validate input
    validateProductInput({
      name: body.name,
      price: parseFloat(body.price),
      min_order_qty: parseInt(body.min_order_qty),
    });

    // Create product
    const product = createProduct({
      name: body.name.trim(),
      price: parseFloat(body.price),
      min_order_qty: parseInt(body.min_order_qty),
      image_path: body.image_path || null,
    });

    return NextResponse.json<ApiResponse<Product>>(
      {
        success: true,
        data: product,
        message: 'Product created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create product',
      },
      { status: 400 }
    );
  }
}
