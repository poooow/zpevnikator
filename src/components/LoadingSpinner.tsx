import React from 'react';
import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#4a5568',
}) => {
  const sizeMap = {
    small: '1rem',
    medium: '2rem',
    large: '4rem',
  };

  const borderWidth = {
    small: '0.15rem',
    medium: '0.2rem',
    large: '0.3rem',
  };

  return (
    <div 
      className="loading-spinner"
      style={{
        '--spinner-size': sizeMap[size],
        '--spinner-color': color,
        '--border-width': borderWidth[size],
      } as React.CSSProperties}
      aria-label="Loading..."
      role="status"
    />
  );
};

export default LoadingSpinner;
