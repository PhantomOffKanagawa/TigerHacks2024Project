import { useState, useEffect } from "react";
import { Recipe, Substitutions } from "@/types/recipe";
import { RecipeService } from "@/services/recipe.service";
import { User } from "firebase/auth";
interface UseRecipesReturn {
  recipes: Recipe[]
  recipe: Recipe | null
  substitutions: Substitutions | null;
  loading: boolean
  error: Error | null
  refreshRecipes: () => Promise<void>
  refreshRecipe: (recipeId: string) => Promise<void>
  loadNextPage: () => void
  refreshSubstitutions: (recipeId: string, userId: string) => Promise<void>;
  setRecipeSubstitutions: (recipeId: string, userId: string) => Promise<void>;
  saveRecipe: (currentUrl: string, user: User) => Promise<void>;
  setError: (error: Error | null) => void;
  isUserRecipe: (recipeId: string) => boolean;
}

export const useRecipes = (
  userId: string,
  recipeId?: string,
  browse: boolean = false,
): UseRecipesReturn => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [substitutions, setSubstitutions] = useState<Substitutions | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(1)


  const isUserRecipe = (recipeId: string) => {
    return recipes.some((recipe) => recipe.id === recipeId);
  }

  const saveRecipe = async (currentUrl: string, user: User) => {
    setLoading(true);
    try {
      const response = await fetch(
        import.meta.env.VITE_API_ENDPOINT.concat('/recipes/save'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: currentUrl,
            userId: user.uid,
          }),
        },
      );
  
      if (!response.ok) {
        throw new Error('Failed to save recipe');
      }
  
      const data = await response.json();
      if (data.recipe) {
        // Fetch the updated recipe list instead of manually updating
        await fetchRecipes();
        return data;
      } else {
        throw new Error('No recipe returned');
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      setError(error instanceof Error ? error : new Error('Failed to save recipe'));
      throw error;
    } finally {
      setLoading(false);
    }
  };
  

  const fetchRecipesByPage = async (pg: number) => {
    try {
      setLoading(true)
      setError(null)

      fetch(import.meta.env.VITE_API_ENDPOINT.concat(`/recipes/all?p=${pg}`), {
        method: 'GET',
      })
        .then((res) => {
          if (!res.ok) {
            console.log(res)
            setError(new Error(`HTTP error! status: ${res.status}`))
          }
          return res.json()
        })
        .then((data) => {
          console.log(data)
          setRecipes(data.recipes)
        })
        .catch((error) => {
          console.error('Error fetching recipe:', error)
          setError(new Error('Failed to find user recipes'))
        })
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch recipes'),
      )
      console.error('Error fetching recipes:', err)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 200)
    }
  }

  const loadNextPage = async () => {
    try {
      setError(null)

      fetch(
        import.meta.env.VITE_API_ENDPOINT.concat(`/recipes/all?p=${page + 1}`),
        {
          method: 'GET',
        },
      )
        .then((res) => {
          if (!res.ok) {
            console.log(res)
            setError(new Error(`HTTP error! status: ${res.status}`))
          }
          return res.json()
        })
        .then((data) => {
          console.log(data)
          // data = data.filter((recipe: Recipe) => recipe.hasOwnProperty("carbonData"));
          // data = data.filter((recipe: Recipe) =>
          //   Object.values(recipe.carbonData)[0]?.hasOwnProperty("match")
          // );
          setRecipes((r) => [...r, ...data.recipes])
        })
        .catch((error) => {
          console.error('Error fetching recipe:', error)
          setError(new Error('Failed to find user recipes'))
        })
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch recipes'),
      )
      console.error('Error fetching recipes:', err)
    } finally {
      setPage((p) => p + 1)
    }
  }
  const fetchRecipes = async () => {
    try {
      setLoading(true)
      setError(null)

      fetch(
        import.meta.env.VITE_API_ENDPOINT.concat('/recipes/user/') + userId,
        {
          method: 'GET',
        },
      )
        .then((res) => {
          if (!res.ok) {
            console.log(res)
            setError(new Error(`HTTP error! status: ${res.status}`))
          }
          return res.json()
        })
        .then((data) => {
          console.log(data)


          // data = data.filter((recipe: Recipe) => recipe.hasOwnProperty("carbonData"));
          // data = data.filter((recipe: Recipe) =>
          //   Object.values(recipe.carbonData)[0]?.hasOwnProperty("match")
          // );

          setRecipes(data)
        })
        .catch((error) => {
          console.error("Error fetching recipe:", error);
          setError(new Error("Failed to find user recipes"));
        });
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch recipes'),
      )
      console.error('Error fetching recipes:', err)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 200)
    }
  }

  const fetchRecipe = async (recipeId: string | undefined) => {
    try {
      setLoading(true)
      setError(null)

      fetch(
        import.meta.env.VITE_API_ENDPOINT.concat('/recipes/id/') + recipeId,
        {
          method: 'GET',
        },
      )
        .then((res) => {
          if (!res.ok) {
            console.log(res)
            setError(new Error(`HTTP error! status: ${res.status}`))
          }
          return res.json()
        })
        .then((data) => {
          console.log(data)
          setRecipe(data)
        })
        .catch((error) => {
          console.error("Error fetching recipe:", error);
          setError(new Error("Failed to find user recipes"));
        });
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch recipes'),
      )
      console.error('Error fetching recipes:', err)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 200)
    }
  };

  const setRecipeSubstitutions = async (recipeId: string, new_substitutions: Substitutions) => {
    try {
      await fetch("https://leangreen.club/api/recipes/substitutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId: recipeId,
          userId: userId,
          substitutions: new_substitutions,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            console.log(res);
            setError(new Error(`HTTP error! status: ${res.status}`));
          }
          return res.json();
        })
        .then((data) => {
          console.log(data);
          setSubstitutions(new_substitutions);
          console.log(substitutions);
        })
        .catch((error) => {
          console.error("Error fetching recipe:", error);
          setError(new Error("Failed to find user recipes"));
        });
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch substitutions")
      );
      console.error("Error fetching substitutions:", err);
    }
  };

  const fetchSubstitutions = async (recipeId: string) => {
    setSubstitutions(Array(recipe?.ingredients.length).fill(null));
    await fetch(
      "https://leangreen.club/api/recipes/substitutions/" + userId + "/" + recipeId,
        {
          method: "GET",
        }
      )
        .then((res) => {
          if (!res.ok) {
            console.log(res);
            setError(new Error(`HTTP error! status: ${res.status}`));
          }
          return res.json();
        })
        .then((data) => {
          console.log("substitutions");
          console.log(data);
          console.log(data.data.substitutions);
          if (data.data.substitutions) {
            setSubstitutions(data.data.substitutions);
          } else {
            setRecipeSubstitutions(recipeId, Array(recipe?.ingredients.length).fill(null));
            setSubstitutions(Array(recipe?.ingredients.length).fill(null));
          }
        })
        .catch((error) => {
          // Initialize empty substitutions array with n null values
          setRecipeSubstitutions(recipeId, Array(recipe?.ingredients.length).fill(null));
          setSubstitutions(Array(recipe?.ingredients.length).fill(null));

          console.error("Error fetching substitutions:", error);
          // setError(new Error("Failed to find user substitutions"));
        });
  };

  // Initial fetch
  useEffect(() => {
    if (browse) {
      fetchRecipesByPage(1)
    } else {
      fetchRecipes()
    }
  }, [userId, recipeId]);

  useEffect(() => {
    if (recipeId) {
      fetchRecipe(recipeId)
    }
  }, [recipes]);

  useEffect(() => {
    if (recipe) {
      fetchSubstitutions(recipe.id);
    }
  }, [recipe]);

  return {
    recipes,
    recipe,
    substitutions,
    loading,
    error,
    loadNextPage,
    refreshRecipes: fetchRecipes,
    refreshRecipe: fetchRecipe,
    refreshSubstitutions: fetchSubstitutions,
    setRecipeSubstitutions: setRecipeSubstitutions,
    saveRecipe: saveRecipe,
    setError,
    isUserRecipe,
  }
}
