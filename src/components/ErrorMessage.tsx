/**
 * ErrorMessage Component
 *
 * Displays error messages in a styled container.
 * Mobile-optimized padding and font sizes.
 */

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      <p className="font-medium text-sm sm:text-base">Error</p>
      <p className="text-xs sm:text-sm mt-1">{message}</p>
    </div>
  );
}
