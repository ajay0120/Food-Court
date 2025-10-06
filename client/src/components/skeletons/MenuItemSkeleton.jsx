import React from 'react';

const MenuItemSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
      {/* Image Skeleton */}
      <div className="flex justify-center mb-4">
        <div className="w-32 h-32 bg-gray-600 rounded-xl animate-pulse"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="text-center">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-600 rounded mb-3 mx-auto w-3/4 animate-pulse"></div>
        
        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-600 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-600 rounded w-2/3 mx-auto animate-pulse"></div>
        </div>
        
        {/* Price and Category Row */}
        <div className="flex justify-between items-center mb-4">
          <div className="h-5 bg-gray-600 rounded w-16 animate-pulse"></div>
          <div className="h-5 bg-gray-600 rounded w-12 animate-pulse"></div>
        </div>
        
        {/* Button Skeleton */}
        <div className="h-12 bg-gray-600 rounded-2xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default MenuItemSkeleton;
