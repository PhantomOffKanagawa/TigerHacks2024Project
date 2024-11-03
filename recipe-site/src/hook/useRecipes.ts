import { useState, useEffect } from 'react'
import { Recipe } from '@/types/recipe'
import { RecipeService } from '@/services/recipe.service'

interface UseRecipesReturn {
  recipes: Recipe[]
  recipe: Recipe | null
  loading: boolean
  error: Error | null
  refreshRecipes: () => Promise<void>
  refreshRecipe: (recipeId: string) => Promise<void>
  loadNextPage: () => void
  setError: (error: Error | null) => void
}

export const useRecipes = (
  userId: string,
  recipeId?: string,
  browse: boolean = false,
): UseRecipesReturn => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState<number>(1)

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
          setRecipes(data)
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

  // Initial fetch
  useEffect(() => {
    if (browse) {
      fetchRecipesByPage(1)
    } else if (recipeId) {
      fetchRecipe(recipeId)
    } else {
      fetchRecipes()
    }
  }, [userId, recipeId])

  return {
    recipes,
    recipe,
    loading,
    error,
    loadNextPage,
    refreshRecipes: fetchRecipes,
    refreshRecipe: fetchRecipe,
    setError,
  }
}
