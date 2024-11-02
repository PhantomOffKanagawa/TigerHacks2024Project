import { FC } from 'react';

export const LoadingSpinner: FC = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-gray-800">
    <div className="max-w-7xl mx-auto py-12 px-6 text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
      <h2 className="text-xl font-semibold text-white mt-4">Loading...</h2>
    </div>
  </div>
);