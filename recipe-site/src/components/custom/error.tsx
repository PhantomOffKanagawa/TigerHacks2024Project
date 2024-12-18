import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/custom/header';
import { useNavigate } from 'react-router-dom';
interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  redirect?: {
    path: string;
    message: string;
  };
}

export const ErrorDisplay: FC<ErrorDisplayProps> = ({ message, onRetry, redirect }) => {
  const navigate = useNavigate();
  return (
  <div className="h-screen w-screen bg-background">
      <Header />
      <div className="flex items-center justify-center min-h-[80vh]">
      <div className="max-w-7xl mx-auto py-12 px-6 text-center">
      <div className="rounded-full h-64 w-64 bg-red-500/30 flex items-center justify-center mx-auto">
        <svg 
          className="h-32 w-32 text-red-500" 
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
      <h2 className="text-3xl font-semibold text-white mt-5">Error</h2>
      <p className="text-gray-400 mt-2 text-xl">{message}</p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="mt-4 bg-red-500/30 hover:bg-red-600/30 block mx-auto"
        >
          Try Again
        </Button>
          )}
          {redirect && (
            <Button 
              onClick={() => navigate(redirect.path)}
              className="mt-4 bg-emerald-500/30 hover:bg-emerald-600/30 block mx-auto"
            >
              {redirect.message}
            </Button>
          )}
      </div>
      </div>
    </div>
  );
};
