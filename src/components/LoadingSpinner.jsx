import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;