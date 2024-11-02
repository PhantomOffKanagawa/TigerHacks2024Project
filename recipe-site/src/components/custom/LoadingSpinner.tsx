import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-background/50">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
    </div>
  );
};

export default LoadingSpinner;
