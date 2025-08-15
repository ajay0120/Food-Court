import React from 'react';

const OrderItemSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-gray-300 rounded w-32"></div>
        <div className="h-6 bg-gray-300 rounded w-20"></div>
      </div>
      
      {/* Order Details Skeleton */}
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
      
      {/* Items Skeleton */}
      <div className="border-t pt-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
      
      {/* Footer Skeleton */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t">
        <div className="h-5 bg-gray-300 rounded w-24"></div>
        <div className="h-5 bg-gray-300 rounded w-16"></div>
      </div>
    </div>
  );
};

export default OrderItemSkeleton;
