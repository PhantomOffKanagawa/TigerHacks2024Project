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

const RecipeList: FC = () => {
  const { user } = useAuth();
  let { recipes, loading, error, refreshRecipes } = useRecipes(user?.uid || "");

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
      <div className="max-w-7xl mx-auto py-12 px-6">
        <h1 className="w-min text-4xl font-bold text-white mb-12 mx-auto">
          Recipes
        </h1>
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
    </div>
  );
};

export default RecipeList;
