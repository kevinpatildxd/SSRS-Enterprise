/**
 * ImageUpload Component
 *
 * Handles image file selection and upload with:
 * - File validation with clear error messages
 * - Preview before upload
 * - Upload progress indication
 * - Success/error handling
 * - Mobile-optimized camera access
 */

'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onUploadSuccess: (imagePath: string) => void;
  onUploadError?: (error: string) => void;
}

interface UploadState {
  preview: string | null;
  uploading: boolean;
  uploaded: boolean;
  error: string;
  uploadedPath: string | null;
}

export default function ImageUpload({ onUploadSuccess, onUploadError }: ImageUploadProps) {
  const [state, setState] = useState<UploadState>({
    preview: null,
    uploading: false,
    uploaded: false,
    error: '',
    uploadedPath: null,
  });

  const resetState = useCallback(() => {
    setState({
      preview: null,
      uploading: false,
      uploaded: false,
      error: '',
      uploadedPath: null,
    });
  }, []);

  const validateFile = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return `File too large. Maximum size is 5MB (your file is ${(file.size / 1024 / 1024).toFixed(2)}MB)`;
    }

    if (file.size === 0) {
      return 'File is empty. Please select a valid image.';
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type "${file.type}". Please use JPEG, PNG, or WebP.`;
    }

    return null;
  };

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Failed to create image preview'));
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Upload failed with status ${response.status}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Upload failed');
    }

    if (!data.data?.imagePath) {
      throw new Error('Upload succeeded but no image path received');
    }

    return data.data.imagePath;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setState(prev => ({
      ...prev,
      preview: null,
      uploading: false,
      uploaded: false,
      error: '',
      uploadedPath: null,
    }));

    const validationError = validateFile(file);
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError }));
      onUploadError?.(validationError);
      return;
    }

    try {
      const previewUrl = await createPreview(file);
      setState(prev => ({ ...prev, preview: previewUrl }));
    } catch {
      setState(prev => ({ ...prev, error: 'Failed to load image preview' }));
      return;
    }

    setState(prev => ({ ...prev, uploading: true, error: '' }));

    try {
      const imagePath = await uploadImage(file);

      setState(prev => ({
        ...prev,
        uploading: false,
        uploaded: true,
        uploadedPath: imagePath,
        error: '',
      }));

      onUploadSuccess(imagePath);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image. Please try again.';
      
      setState(prev => ({
        ...prev,
        uploading: false,
        uploaded: false,
        error: errorMessage,
      }));

      onUploadError?.(errorMessage);
    }
  };

  const handleRetry = () => {
    const fileInput = document.getElementById('product-image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    resetState();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Product Image
        <span className="text-gray-400 ml-1">(optional)</span>
      </label>

      <div className="relative">
        <input
          id="product-image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          capture="environment"
          onChange={handleFileChange}
          disabled={state.uploading}
          className="block w-full text-sm text-gray-500
            file:mr-3 file:py-2.5 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-white
            hover:file:bg-blue-600
            file:cursor-pointer
            file:disabled:opacity-50
            file:disabled:cursor-not-allowed
            file:touch-manipulation
            cursor-pointer
            disabled:cursor-not-allowed"
        />
      </div>

      <p className="text-xs text-gray-500">
        Accepts JPEG, PNG, WebP. Max 5MB. Images are automatically optimized.
      </p>

      {state.preview && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <div className="relative w-full h-48 sm:h-64 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
            <Image
              src={state.preview}
              alt="Product preview"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      )}

      {state.uploading && (
        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-md">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
          <span className="text-sm">Uploading and optimizing image...</span>
        </div>
      )}

      {state.uploaded && state.uploadedPath && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Image uploaded successfully!</span>
          </div>
        </div>
      )}

      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-3 rounded-md">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm">{state.error}</p>
              <button
                onClick={handleRetry}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-800 underline"
              >
                Try again with a different image
              </button>
            </div>
          </div>
        </div>
      )}

      {state.uploaded && (
        <button
          type="button"
          onClick={handleRetry}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Remove image and upload different one
        </button>
      )}
    </div>
  );
}
