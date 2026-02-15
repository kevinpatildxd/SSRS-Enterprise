/**
 * Product By ID API Route
 *
 * Endpoints:
 * - DELETE /api/products/[id] - Delete product
 * - GET /api/products/[id] - Get single product
 * - PATCH /api/products/[id] - Update product (future)
 *
 * Features:
 * - Validates product ID format
 * - Deletes associated image from storage
 * - Proper error handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { deleteProduct, getProductById, updateProduct } from '@/lib/db';
import { deleteImage } from '@/lib/imageProcessor';
import type { ApiResponse, ApiError } from '@/types/api';
import type { Product, ProductUpdate } from '@/types/product';

/**
 * Validate product ID format
 */
function isValidProductId(id: string): boolean {
  return /^prod_\d+$/.test(id);
}

/**
 * GET /api/products/[id]
 * Gets a single product by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Product ID is required',
        },
        { status: 400 }
      );
    }

    if (!isValidProductId(id)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Invalid product ID format',
        },
        { status: 400 }
      );
    }

    // Fetch product
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Product>>({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: 'Failed to fetch product',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]
 * Deletes a product and its associated image
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Product ID is required',
        },
        { status: 400 }
      );
    }

    if (!isValidProductId(id)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Invalid product ID format',
        },
        { status: 400 }
      );
    }

    // Check if product exists and get image path
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    // Delete image if exists (do this before deleting product)
    if (product.image_path) {
      try {
        await deleteImage(product.image_path);
      } catch (imageError) {
        // Log but don't fail - product will still be deleted
        console.warn('Failed to delete image for product', id, imageError);
      }
    }

    // Delete product from database
    const deleted = await deleteProduct(id);

    if (!deleted) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Failed to delete product from database',
        },
        { status: 500 }
      );
    }

    // Revalidate home page cache so deleted product disappears immediately
    revalidatePath('/');

    return NextResponse.json<ApiResponse<{ id: string; deleted: boolean }>>(
      {
        success: true,
        data: { id, deleted: true },
        message: 'Product deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: 'Failed to delete product',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/products/[id]
 * Updates a product partially
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Product ID is required',
        },
        { status: 400 }
      );
    }

    if (!isValidProductId(id)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Invalid product ID format',
        },
        { status: 400 }
      );
    }

    // Parse request body
    let body: ProductUpdate;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Invalid request body',
        },
        { status: 400 }
      );
    }

    // Validate at least one field is provided
    if (Object.keys(body).length === 0) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'No fields provided for update',
        },
        { status: 400 }
      );
    }

    // Validate fields if provided
    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim().length < 2) {
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: 'Product name must be at least 2 characters',
          },
          { status: 400 }
        );
      }
    }

    if (body.price !== undefined) {
      if (typeof body.price !== 'number' || body.price < 0 || body.price > 1000000) {
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: 'Price must be between 0 and 1,000,000',
          },
          { status: 400 }
        );
      }
    }

    if (body.min_order_qty !== undefined) {
      if (typeof body.min_order_qty !== 'string' || body.min_order_qty.trim().length === 0) {
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: 'Minimum order quantity is required',
          },
          { status: 400 }
        );
      }
    }

    // Check if product exists
    const existing = await getProductById(id);
    if (!existing) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    // Update product in database
    const updated = await updateProduct(id, body);

    if (!updated) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Failed to update product',
        },
        { status: 500 }
      );
    }

    // Revalidate home page cache so updated product appears immediately
    revalidatePath('/');

    return NextResponse.json<ApiResponse<Product>>({
      success: true,
      data: updated,
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('Error updating product:', error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: 'Failed to update product',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
