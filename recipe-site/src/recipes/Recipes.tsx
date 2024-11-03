import { FC, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

import { useRecipes } from "@/hook/useRecipes";
import { LoadingSpinner } from "@/components/custom/loading";
import { ErrorDisplay } from "@/components/custom/error";
import { Header } from "@/components/custom/header";
import { ExtensionBanner } from "components/custom/ExtensionBanner";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "firebase/auth";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";

const RecipeList: FC = () => {
  const { user } = useAuth();
  let { recipes, loading, error, refreshRecipes, saveRecipe } = useRecipes(user?.uid || "");

  recipes = recipes.filter((recipe) => recipe.hasOwnProperty("carbonData"));
  recipes = recipes.filter((recipe) =>
    Object.values(recipe.carbonData)[0]?.hasOwnProperty("match")
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error.message} onRetry={refreshRecipes} />;
  }

  return (
    <div className="h-full w-full bg-background">
      <ExtensionBanner dismissable={true} />
      <Header />
      <main className="bg-emerald-800/10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {user && <h1 className="text-white text-center mb-4 text-4xl">Hello {user.email}</h1>}
          <h4 className="w-min text-2xl font-bolxd text-white mb-12 mx-auto">
            Recipes
        </h4>
        {user && (
          <div className='flex gap-4 max-w-2xl mx-auto mb-12 bg-white/5 p-6 rounded-lg shadow-lg'>
<Input
  type='text'
  name='url'
  className='flex-1 rounded-lg bg-white/10 border-0 text-white placeholder:text-gray-400 focus:border-emerald-500'
  placeholder='Paste a recipe URL to import...'
  id='recipeUrl'
  onKeyDown={async (e) => {
    if (e.key === 'Enter') {
      const input = document.getElementById('recipeUrl') as HTMLInputElement;
      try {
        await saveRecipe(input.value, user);
        input.value = ''; // Clear input after successful save
      } catch (err) {
        console.error('Failed to save recipe:', err);
      }
    }
  }}
/>
<Button
  className='px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2'
  onClick={async () => {
    const input = document.getElementById('recipeUrl') as HTMLInputElement;
    try {
      await saveRecipe(input.value, user);
      input.value = ''; // Clear input after successful save
    } catch (err) {
      console.error('Failed to save recipe:', err);
    }
  }}
>
              <span>Add Recipe</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Button>
          </div>
        )}
        {recipes.length == 0 ? (
          <div className="text-white text-center text-2xl">
            No recipes found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Card
                key={recipe.canonical_url}
                className="bg-card p-6 rounded-lg flex flex-col"
              >
                <img
                  className="bg-gray-700/10 w-full h-[250px] rounded-lg object-cover"
                  src={recipe.image}
                  alt={recipe.title}
                />
                <div className="space-y-4 py-2 flex-1 flex flex-col">
                  <Link to={`/recipes/${recipe.id}`}>
                    <h2 className="text-xl font-semibold text-white underline">
                      {recipe.title}
                    </h2>
                  </Link>
                  <p className="text-gray-200 flex-grow">
                    {recipe.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    {recipe.averageCarbonScore && (
                      <div className="mb-[-10px] flex w-full flex-col space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">
                            Carbon Score
                          </span>
                          <span
                            className={`text-sm ${
                              recipe.averageCarbonScore >= 0.7
                                ? "text-green-400"
                                : recipe.averageCarbonScore >= 0.3
                                  ? "text-yellow-400"
                                  : "text-red-400"
                            }`}
                          >
                            {Math.round(recipe.averageCarbonScore * 100)}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              recipe.averageCarbonScore >= 0.7
                                ? "bg-green-400"
                                : recipe.averageCarbonScore >= 0.3
                                  ? "bg-yellow-400"
                                  : "bg-red-400"
                            }`}
                            style={{
                              width: `${Math.round(recipe.averageCarbonScore * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        </div>
      </main>
    </div>
  );
};

export default RecipeList;
