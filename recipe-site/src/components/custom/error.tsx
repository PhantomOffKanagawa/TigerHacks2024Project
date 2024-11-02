import { FC } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorDisplay: FC<ErrorDisplayProps> = ({ message, onRetry }) => (
  <div className="h-screen w-screen flex items-center justify-center bg-gray-800">
    <div className="max-w-7xl mx-auto py-12 px-6 text-center">
      <div className="rounded-full h-32 w-32 bg-red-500/10 flex items-center justify-center mx-auto">
        <svg 
          className="h-16 w-16 text-red-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-white mt-4">Error</h2>
      <p className="text-gray-400 mt-2">{message}</p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="mt-4 bg-red-500 hover:bg-red-600"
        >
          Try Again
        </Button>
      )}
    </div>
  </div>
);