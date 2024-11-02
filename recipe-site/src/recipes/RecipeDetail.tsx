import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Recipe } from '@/types/recipe';

import { useRecipes } from '@/hook/useRecipes';
import { LoadingSpinner } from '@/components/custom/loading';
import { ErrorDisplay } from '@/components/custom/error';
import { Header } from '@/components/custom/header';
const RecipeDetail: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { recipes, loading, error, refreshRecipes } = useRecipes('mock-user-id');

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error.message} onRetry={refreshRecipes} />;
  }

  // Get with ID
  // TODO: Firebase only retrieve this recipe?
  const recipe = recipes.find((r) => r.id === parseInt(id || ''));

  if (!recipe) {
    return <ErrorDisplay message="Recipe not found" onRetry={refreshRecipes} />;
  }

  return (
    <div className="bg-gray-800 min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto py-12 px-6">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Recipes
        </button>
        
        <Card className="bg-gray-800 p-8 rounded-lg">
          <h1 className="text-4xl font-bold text-white mb-4">{recipe.title}</h1>
          <div className="space-y-6">
            <div className="aspect-video bg-gray-700 rounded-lg" />
            
            <div className="flex items-center space-x-4 text-gray-400">
              <span>By {recipe.author}</span>
              <span>•</span>
              <span>{recipe.cuisine} Cuisine</span>
            </div>

            <p className="text-gray-300">{recipe.description}</p>

            <div className="grid grid-cols-3 gap-4 text-gray-300">
              <div>
                <h3 className="font-semibold">Prep Time</h3>
                <p>{recipe.prep_time} mins</p>
              </div>
              <div>
                <h3 className="font-semibold">Cook Time</h3>
                <p>{recipe.cook_time} mins</p>
              </div>
              <div>
                <h3 className="font-semibold">Total Time</h3>
                <p>{recipe.total_time} mins</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-3">Ingredients</h2>
              <ul className="list-disc list-inside text-gray-300">
                {recipe.ingredients.map((ingredient: string, index: number) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-3">Instructions</h2>
              <ol className="list-decimal list-inside text-gray-300">
                {recipe.instructions_list.map((instruction: string, index: number) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>

            <div className="flex justify-between items-center">
              {recipe.ecoScore && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Eco Score</span>
                  <span className="text-green-400">{recipe.ecoScore}</span>
                </div>
              )}
              {recipe.rating && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Rating</span>
                  <span className="text-blue-400">{recipe.rating}/5</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecipeDetail;