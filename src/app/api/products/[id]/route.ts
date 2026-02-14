/**
 * Product By ID API Route
 *
 * Endpoints:
 * - DELETE /api/products/[id] - Delete product
 * - PATCH /api/products/[id] - Update product (future)
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteProduct, getProductById } from '@/lib/db';
import { deleteImage } from '@/lib/imageProcessor';
import type { ApiResponse, ApiError } from '@/types/api';

/**
 * DELETE /api/products/[id]
 * Deletes a product and its associated image
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if product exists
    const product = getProductById(id);
    if (!product) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    // Delete image if exists
    if (product.image_path) {
      await deleteImage(product.image_path);
    }

    // Delete product from database
    const deleted = deleteProduct(id);

    if (!deleted) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Failed to delete product',
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: null,
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

// Future: Add PATCH for updating products
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   // Implementation for updating products
// }
