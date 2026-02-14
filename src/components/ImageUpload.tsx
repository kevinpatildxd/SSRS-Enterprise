/**
 * ImageUpload Component
 *
 * Handles image file selection and upload with:
 * - File validation
 * - Preview before upload
 * - Progress indication
 * - Error handling
 * - Mobile-optimized camera access
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onUploadSuccess: (imagePath: string) => void;
}

export default function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state
    setError('');
    setPreview(null);
    setUploaded(false);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }

      // Call success callback with image path
      onUploadSuccess(data.data.imagePath);
      setUploaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Image
      </label>

      {/* File Input - Mobile optimized with camera access */}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-3 file:py-2.5 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-primary file:text-white
          hover:file:bg-blue-600
          file:cursor-pointer
          file:touch-manipulation
          cursor-pointer"
      />

      <p className="mt-1 text-xs text-gray-500">
        Accepts JPEG, PNG, WebP. Max 5MB.
      </p>

      {/* Preview - Responsive sizing */}
      {preview && (
        <div className="mt-4 relative w-full h-48 sm:h-64 bg-gray-100 rounded-md overflow-hidden">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-contain"
          />
        </div>
      )}

      {/* Upload Status */}
      {uploading && (
        <div className="mt-2 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
          <p className="text-sm text-blue-600">Uploading image...</p>
        </div>
      )}

      {/* Success Message */}
      {uploaded && (
        <div className="mt-2 bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-md text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Image uploaded successfully
        </div>
      )}

      {/* Error - Mobile friendly display */}
      {error && (
        <div className="mt-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
