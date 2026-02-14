/**
 * Loading Component
 *
 * Simple loading spinner for async operations.
 * Mobile-optimized centering and sizing.
 */

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-primary border-t-transparent mx-auto"></div>
        <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading...</p>
      </div>
    </div>
  );
}
