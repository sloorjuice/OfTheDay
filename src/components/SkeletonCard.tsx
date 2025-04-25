
// components/SkeletonCard.tsx
export default function SkeletonCard() {
    return (
      <div className="w-full max-w-md mx-auto p-6 rounded-lg bg-gray-700 animate-pulse shadow-md">
        <div className="h-48 bg-gray-600 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-6 bg-gray-600 rounded w-3/4"></div>
          <div className="h-4 bg-gray-600 rounded w-5/6"></div>
          <div className="h-4 bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
  