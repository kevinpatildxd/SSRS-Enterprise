/**
 * Auth API Route
 *
 * Endpoint:
 * - POST /api/auth - Verify admin password
 *
 * Returns success/failure without exposing the actual password
 */

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, ApiError } from '@/types/api';

/**
 * POST /api/auth
 * Verifies admin password
 *
 * Body: { password: string }
 * Returns: { success: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Password is required',
        },
        { status: 400 }
      );
    }

    // Verify against environment variable
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD not set in environment');
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Server configuration error',
        },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: { authenticated: true },
        message: 'Authentication successful',
      });
    } else {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Invalid password',
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: 'Authentication failed',
      },
      { status: 500 }
    );
  }
}
