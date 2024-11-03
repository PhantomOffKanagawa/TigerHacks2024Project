import { FC, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

import { useRecipes } from "@/hook/useRecipes";
import { ErrorDisplay } from "@/components/custom/error";
import { Header } from "@/components/custom/header";
import { Skeleton } from "components/ui/skeleton";
import { Checkbox } from "components/ui/checkbox";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "components/ui/dialog";
import {
  getSubstitutions,
  hasSubstitutions,
} from "@/utils/substitutions.utils";
import { useAuth } from "@/contexts/AuthContext";

const RecipeDetail: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { recipe, loading, error, setError, refreshRecipe } = useRecipes(
    user?.uid || "",
    id
  );
  // const [showSubstitutes, setShowSubstitutes] = useState(false);
  // const [ingredientToSubstitute, setIngredientToSubstitute] = useState(null);

  const ecoClasses = (score: number) => {
    if (score >= 70) return (
      <div className="w-full flex items-center space-x-2 p-3 rounded-lg shadow-lg bg-green-900 border border-green-800/30 sticky top-2 bottom-2 z-10">
      <span className="text-sm text-gray-300 font-medium">Eco Score</span>
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          {score}
        </span>
        <span className="text-gray-400 font-medium">/100</span>
      </div>
      <div className="ml-2">
        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse animate-pulse-slow" />
      </div>
    </div>
    );
    if (score >= 30) return (
      <div className="w-full flex items-center space-x-2 p-3 rounded-lg shadow-lg bg-yellow-900 border border-yellow-800/30 sticky top-2 bottom-2 z-10">
      <span className="text-sm text-gray-300 font-medium">Eco Score</span>
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
          {score}
        </span>
        <span className="text-gray-400 font-medium">/100</span>
      </div>
      <div className="ml-2">
        <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse animate-pulse-fast" />
      </div>
    </div>
    );
    return (
        <div className="w-full flex items-center space-x-2 p-3 rounded-lg shadow-lg bg-red-900 border border-red-800/30 sticky top-2 bottom-2 z-10">
        <span className="text-sm text-gray-300 font-medium">Eco Score</span>
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
            {score}
          </span>
          <span className="text-gray-400 font-medium">/100</span>
        </div>
        <div className="ml-2">
          <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse animate-pulse-faster" />
        </div>
      </div>
      );
  };

  // Move data processing into useMemo - always declare it, even if recipe is null
  const ingredientData = useMemo(() => {
    if (!recipe) return [];
    if (recipe.carbonData == null) {
      setError(new Error("No carbon data found"));
      return [];
    }

    if (recipe.sanitizedIngredients == null) {
      setError(new Error("No sanitized ingredients found"));
      return [];
    }

    console.log(recipe);

    const ingredients = recipe.ingredients;
    const sanitizedIngredients = recipe.sanitizedIngredients;

    return sanitizedIngredients.map((ingredient, index) => ({
      name: ingredients[index],
      sanitizedName: ingredient,
      score: recipe.carbonData[ingredient].score,
      substitution: null,
      substitutionScore: -1,
    }));
  }, [recipe]);

  const carbonScore = useMemo(() => {
    let count = 0;
    return Math.round(
      (Object.values(ingredientData).reduce((acc: number, curr: any) => {
        if (curr.score != -1) count++;
        return acc + (curr.score == -1 ? 0 : curr.score);
      }, 0) /
        count) *
        100
    );
  }, [recipe]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto py-12 px-6">
          <Card className="p-8 rounded-lg">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="aspect-video w-full mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        message={error.message}
        onRetry={() => refreshRecipe(id || "")}
        redirect={{
          path: "/recipes",
          message: "Go to Recipes"
        }}
      />
    );
  }

  if (!recipe && !loading) {
    return (
      <ErrorDisplay
        message="Recipe not found"
        onRetry={() => refreshRecipe(id || "")}
      />
    );
  }

  if (!recipe) return null;

  const substituteIngredient = (index: number, sub: any) => {
    // if (!recipe.carbonData[index].original) {
    //   recipe.sanitizedIngredients[index].original =
    //     recipe.sanitizedIngredients[index].name;
    //   recipe.sanitizedIngredients[index].originalEcoScore =
    //     recipe.sanitizedIngredients[index].ecoScore;
    // }
    // recipe.sanitizedIngredients[index].name = sub.name;
    // recipe.sanitizedIngredients[index].ecoScore = sub.ecoScore;
    // refreshRecipe(id || "");
  };

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
          <a href={recipe.canonical_url} target="_blank" rel="noopener noreferrer">
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold text-white mb-2 font-display hover:text-gray-300 transition-colors flex items-start">
                {recipe.title}
                  <span className="ml-4 mt-[-2px] text-gray-500 text-sm">
                    <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </span>
              </h1>
              {recipe.canonical_url && (
                <span className="text-sm text-gray-400 mb-4">
                from {new URL(recipe.canonical_url).hostname.replace('www.', '')}
              </span>
              )}
            </div>
          </a>
          <div className="space-y-6">
            <img
              className="aspect-video bg-gray-700/20 rounded-lg"
              src={recipe.image}
              alt={recipe.title}
            />

            <div className="grid auto-cols-fr grid-flow-col gap-4 text-gray-300">
              {recipe.prep_time && (
                <div>
                  <h3 className="font-semibold text-center">Prep Time</h3>
                  <p className="text-center">{recipe.prep_time} mins</p>
                </div>
              )}
              {recipe.cook_time && (
                <div>
                  <h3 className="font-semibold text-center">Cook Time</h3>
                  <p className="text-center">{recipe.cook_time} mins</p>
                </div>
              )}
              {recipe.total_time && (
                <div>
                  <h3 className="font-semibold text-center">Total Time</h3>
                  <p className="text-center">{recipe.total_time} mins</p>
                </div>
              )}
            </div>

            <hr className="my-6" />

            <div className="flex items-center space-x-4 text-gray-400">
              <span>By {recipe.author}</span>
              <span>•</span>
              <span>{recipe.cuisine} Cuisine</span>
            </div>

            <p className="text-gray-300">{recipe.description}</p>

            {recipe.carbonData && (
              ecoClasses(carbonScore)
            )}

            <div>
              <h2 className="text-2xl font-semibold text-white mb-3">
                Ingredients
              </h2>
              <ul className="list-disc list-inside text-gray-300">
                {ingredientData.map((ingredient, index) => (
                  <div key={`ingredient-${index}`}>
                    <li
                      className="flex items-start space-x-2 my-1"
                    >
                      <Checkbox className="text-green-400 me-2 my-auto" />
                      {ingredient.name}
                      <div className="flex-1"></div>
                      <div className="text-gray-400">
                        {ingredient.score != -1
                          ? Math.round(ingredient.score * 100)
                          : ""}
                      </div>
                    </li>
                    <hr className="my-1 border-white/30 border-dashed border-t" />
                  </div>
                ))}

                {/* TODO: Animate the eco score */}
                <div className="flex justify-between w-full items-center">

                  {/* {recipe.rating && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Rating</span>
                  <span className="text-blue-400">{recipe.rating}/5</span>
                </div>
              )} */}
                </div>

                {/* {Object.keys(recipe.carbonData).map((sanitizedIngredient: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Checkbox className="text-green-400 me-2" />
                    {recipe.carbonData[sanitizedIngredient].score != -1 ? (
                      <span className="text-gray-400">
                        {"substituted Ingredient"} (substituted
                        for {recipe.ingredients[index]})
                      </span>
                    ) : (
                      <span>{ingredient}</span>
                    )}
                    <div className="flex-1"></div>
                    {hasSubstitutions(
                      recipe.sanitizedIngredients[index].original
                        ? recipe.sanitizedIngredients[index].original
                        : recipe.sanitizedIngredients[index].name
                    ) ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-14 text-lg p-0 text-gray-400 ml-auto text-right underline"
                          >
                            {recipe.sanitizedIngredients[index].ecoScore}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>
                              Substitute{" "}
                              {recipe.sanitizedIngredients[index].name}
                            </DialogTitle>
                            <DialogDescription>
                              Choose a more eco-friendly alternative
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {recipe.sanitizedIngredients[index].name && (
                              <div className="space-y-4">
                                {getSubstitutions(
                                  recipe.sanitizedIngredients[index].original
                                    ? recipe.sanitizedIngredients[index]
                                        .original
                                    : recipe.sanitizedIngredients[index].name,
                                  recipe.sanitizedIngredients[index].original
                                    ? recipe.sanitizedIngredients[index].name
                                    : undefined
                                ).map((sub) => (
                                  <div
                                    key={sub.name}
                                    className="flex items-center justify-between p-2 hover:bg-gray-700/10 rounded"
                                  >
                                    <span>{sub.name}</span>
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`${sub.ecoScore > recipe.sanitizedIngredients[index].ecoScore ? "text-green-500" : "text-red-500"}`}
                                      >
                                        {sub.ecoScore >
                                        recipe.sanitizedIngredients[index]
                                          .ecoScore
                                          ? "↑"
                                          : "↓"}
                                        {Math.abs(
                                          sub.ecoScore -
                                            recipe.sanitizedIngredients[index]
                                              .ecoScore
                                        )}
                                      </span>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          substituteIngredient(index, sub)
                                        }
                                      >
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
                ))} */}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-3">
                Instructions
              </h2>
              <ol className="list-decimal list-inside text-gray-300">
                {recipe.instructions_list.map(
                  (instruction: string, index: number) => (
                    <li key={index}>{instruction}</li>
                  )
                )}
              </ol>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecipeDetail;
