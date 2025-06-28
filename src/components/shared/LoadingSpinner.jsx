// src/components/shared/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}
        style={{ borderColor: '#02276F' }}
      ></div>
      <p className="mt-4 text-gray-600 text-sm">{message}</p>
    </div>
  );
};

export default LoadingSpinner;