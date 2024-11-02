import { useState, useEffect } from 'react';
import { Recipe } from '@/types/recipe';
import { RecipeService } from '@/services/recipe.service';

interface UseRecipesReturn {
  recipes: Recipe[];
  loading: boolean;
  error: Error | null;
  refreshRecipes: () => Promise<void>;
}

export const useRecipes = (userId: string): UseRecipesReturn => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const userRecipes = await RecipeService.getUserRecipes(userId);
      await new Promise(
        resolve => setTimeout(resolve, 500)
      );
      setRecipes(userRecipes);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch recipes'));
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  if (Math.random() < 0.1) {
    setError(new Error('Failed to fetch recipes (Random 1/10 chance)'));
  }

  // Initial fetch
  useEffect(() => {
    fetchRecipes();
  }, [userId]);

  return {
    recipes,
    loading,
    error,
    refreshRecipes: fetchRecipes
  };
};