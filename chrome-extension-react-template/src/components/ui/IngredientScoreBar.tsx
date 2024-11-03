import React from 'react';

interface IngredientScoreBarProps {
  name: string;
  score: number;
}

const IngredientScoreBar: React.FC<IngredientScoreBarProps> = ({ name, score }) => {
  return (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-white">{name}</span>
        <span className="text-sm font-medium text-white">{score}/100</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div 
          className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
          style={{ 
            width: `${score}%`,
            backgroundColor: score > 66 ? '#22c55e' : score > 33 ? '#eab308' :'#ef4444' 
          }}
        />
      </div>
    </div>
  );
};

export default IngredientScoreBar;