
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner = ({ size = 'medium' }: LoadingSpinnerProps) => {
  const sizeMap = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeMap[size]} border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow`}></div>
    </div>
  );
};

export default LoadingSpinner;
