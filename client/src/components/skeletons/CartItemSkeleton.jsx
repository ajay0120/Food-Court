import React from 'react';

const CartItemSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
      {/* Content Skeleton */}
      <div className="flex flex-col items-center text-center">
        {/* Image Skeleton */}
        <div className="w-32 h-32 bg-gray-600 rounded-xl mb-4 animate-pulse"></div>
        
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-600 rounded w-3/4 mb-3 animate-pulse"></div>
        
        {/* Description Skeleton */}
        <div className="space-y-2 mb-4 w-full">
          <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-600 rounded w-2/3 mx-auto animate-pulse"></div>
        </div>
        
        {/* Price and Controls Skeleton */}
        <div className="flex justify-between items-center w-full mb-4">
          <div className="h-5 bg-gray-600 rounded w-16 animate-pulse"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-600 rounded animate-pulse"></div>
            <div className="w-8 h-6 bg-gray-600 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-600 rounded animate-pulse"></div>
          </div>
        </div>
        
        {/* Total Price Skeleton */}
        <div className="h-6 bg-gray-600 rounded w-20 animate-pulse"></div>
      </div>
    </div>
  );
};

export default CartItemSkeleton;
