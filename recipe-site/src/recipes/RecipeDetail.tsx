import { FC, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

import { useRecipes } from '@/hook/useRecipes';
import { LoadingSpinner } from '@/components/custom/loading';
import { ErrorDisplay } from '@/components/custom/error';
import { Header } from '@/components/custom/header';
import { Skeleton } from 'components/ui/skeleton';
import { Checkbox } from 'components/ui/checkbox';
import { Button } from 'components/ui/button';
import { Info } from 'lucide-react';
import { Dialog, DialogDescription, DialogTitle, DialogHeader, DialogContent, DialogTrigger } from 'components/ui/dialog';
import { getSubstitutions, hasSubstitutions } from '@/utils/substitutions.utils';
const RecipeDetail: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Get recipe data
  const { recipe, loading, error, refreshRecipe } = useRecipes('mock-user-id', id);

  console.log(recipe);

  // State for substitutes and substitutes modal 
  const [showSubstitutes, setShowSubstitutes] = useState(false);
  const [ingredientToSubstitute, setIngredientToSubstitute] = useState(null);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error.message} onRetry={() => refreshRecipe(id || '')} />;
  }

  if (!recipe) {
    return <ErrorDisplay message="Recipe not found" onRetry={() => refreshRecipe(id || '')} />;
  }

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto py-12 px-6">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Recipes
        </button>
        
        <Card className="p-8 rounded-lg">
          <h1 className="text-4xl font-bold text-white mb-4 font-display">{recipe.title}</h1>
          <div className="space-y-6">
            <Skeleton className="aspect-video bg-gray-700/20 rounded-lg" />
            
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
                  <li key={index} className="flex items-center space-x-2">
                    <Checkbox className="text-green-400 me-2" />
                    {ingredient}
                    <div className="flex-1"></div>
                    {/* TODO: Rework datastructure to include original ingredient name with score normalized ingredients */}
                    {hasSubstitutions(recipe.sanitizedIngredients[index].name) ? (
                      <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-14 text-lg p-0 text-gray-400 ml-auto text-right underline">
                          {recipe.sanitizedIngredients[index].ecoScore}
                          {/* <Info className="w-4 h-4" /> */}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Substitute {recipe.sanitizedIngredients[index].name}</DialogTitle>
                          <DialogDescription>
                            Choose a more eco-friendly alternative
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                        {recipe.sanitizedIngredients[index].name && (
                          <div className="space-y-4">
                            {getSubstitutions(recipe.sanitizedIngredients[index].name).map(sub => (
                              <div key={sub.name} className="flex items-center justify-between p-2 hover:bg-gray-700/10 rounded">
                                <span>{sub.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className={`${sub.ecoScore > recipe.sanitizedIngredients[index].ecoScore ? 'text-green-500' : 'text-red-500'}`}>
                                    {sub.ecoScore > recipe.sanitizedIngredients[index].ecoScore ? '↑' : '↓'}
                                    {Math.abs(sub.ecoScore - recipe.sanitizedIngredients[index].ecoScore)}
                                  </span>
                                  <Button variant="outline" size="sm">
                                    Use This
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        </div>  
                      </DialogContent>
                    </Dialog>
                    ) : (
                      <div className="w-14 text-lg p-0 ml-auto text-center">
                        {recipe.sanitizedIngredients[index].ecoScore}
                      </div>
                    )}
                  </li>
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