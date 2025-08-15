import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="flex items-center space-x-6 mb-8">
        {/* Avatar Skeleton */}
        <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
        
        {/* Profile Info Skeleton */}
        <div className="flex-1">
          <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
          <div className="h-5 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
      
      {/* Form Fields Skeleton */}
      <div className="space-y-6">
        {/* Name Field */}
        <div>
          <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>
        
        {/* Email Field */}
        <div>
          <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>
        
        {/* Phone Field */}
        <div>
          <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>
        
        {/* Address Field */}
        <div>
          <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
          <div className="h-24 bg-gray-300 rounded"></div>
        </div>
        
        {/* Button Skeleton */}
        <div className="h-12 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
