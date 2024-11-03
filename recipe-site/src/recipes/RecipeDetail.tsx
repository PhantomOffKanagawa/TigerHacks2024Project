import { FC, useEffect, useMemo, useState } from "react";
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
import LoadingSpinner from "@/components/custom/LoadingSpinner";

import { co2Data } from "@/data/co2_data";
import { substitutions } from "@/data/substitutions";

const RecipeDetail: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    recipe,
    loading,
    error,
    setError,
    refreshRecipe,
    refreshSubstitutions,
    setRecipeSubstitutions,
    substitutions,
    isUserRecipe,
    saveRecipe,
    refreshRecipes,
  } = useRecipes(user?.uid || "", id);

  const [showSubstitutes, setShowSubstitutes] = useState(false);
  const [ingredientToSubstituteIndex, setIngredientToSubstituteIndex] = useState(-1);
  const [specificSubstitutions, setSpecificSubstitutions] = useState(null);

  const [isSaving, setSaving] = useState(false);

  const returnSubstitutionButton = (index: number) => {
    const ingredient = ingredientData[index];

    if (ingredient.score == -1) return null;

    if (!hasSubstitutions(ingredient.match)) return (
      <>
        <div className="text-gray-300 text-lg">
          {Math.round(ingredient.score * 100)}
        </div>
        <Button variant="ghost" onClick={() => substituteIngredient(index, { name: "", score: -2 })}
          className="text-gray-200 text-lg p-0 h-[28px] w-[30px]" style={{marginRight: "-5px", marginBottom: "-1px"}}>
          X
        </Button>
      </>
    );

    console.log("matched");

    return (
      <>
        <Button variant="ghost" className="text-gray-200 underline text-lg p-0 h-[28px] w-[30px]" style={{marginRight: "-5px", marginBottom: "-1px"}} onClick={() => openSubstitutions(ingredient, index)}>
          {Math.round(ingredient.substitutionScore > 0 ? ingredient.substitutionScore * 100 : ingredient.score * 100)}
        </Button>
        <Button variant="ghost" onClick={() => substituteIngredient(index, { name: "", score: -2 })}
          className="text-gray-200 text-lg p-0 h-[28px] w-[30px]" style={{marginRight: "-5px", marginBottom: "-1px"}}>
          X
        </Button>
      </>
    );
  };

  const openSubstitutions = (ingredient: any, index: number) => {
    setIngredientToSubstituteIndex(index);
    setShowSubstitutes(true);
    const options = getSubstitutions(ingredient.match, ingredient.substitution);
    setSpecificSubstitutions(options as any);
  }

  const ecoClasses = (score: number) => {
    const colors = {
      high: {
        bg: "bg-green-900",
        border: "border-green-800/30", 
        text: "from-green-400 to-emerald-400",
        dot: "bg-green-400",
        speed: "animate-pulse-slow"
      },
      mid: {
        bg: "bg-yellow-900",
        border: "border-yellow-800/30",
        text: "from-yellow-400 to-amber-400", 
        dot: "bg-yellow-400",
        speed: "animate-pulse-fast"
      },
      low: {
        bg: "bg-red-900", 
        border: "border-red-800/30",
        text: "from-red-400 to-rose-400",
        dot: "bg-red-400",
        speed: "animate-pulse-faster"
      }
    };

    const theme = score >= 70 ? colors.high : score >= 30 ? colors.mid : colors.low;

    return (
      <div className={`w-full flex justify-between items-center space-x-2 p-3 rounded-lg shadow-lg ${theme.bg} border ${theme.border} sticky top-2 bottom-2 z-10 transition-colors duration-500`}>
        <span className="text-sm text-gray-300 font-medium">Carbon Footprint Score:</span>
        <div className="flex-1"></div>
        <div className="flex items-center gap-1">
          <span className={`text-2xl font-bold bg-gradient-to-r ${theme.text} bg-clip-text text-transparent transition-all duration-500`}>
            {score}
          </span>
          <span className="text-gray-400 font-medium">/100</span>
        </div>
        <div className="ml-2">
          <div className={`w-3 h-3 rounded-full ${theme.dot} ${theme.speed} transition-colors duration-500`} />
        </div>
      </div>
    );
  };

  // Move data processing into useMemo - always declare it, even if recipe is null
  let ingredientData = useMemo(() => {
    console.log("hi");
    if (!recipe) return [];
    if (recipe.carbonData == null) {
      setError(new Error("No carbon data found"));
      return [];
    }
  
    if (Object.values(recipe.carbonData)[0].hasOwnProperty("match") == false) {
      setError(new Error("Improper data found"));
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
      match: recipe.carbonData[ingredient].match,
      substitution: substitutions ? substitutions[index] : null,
      substitutionScore: substitutions
        ? substitutions[index] != null ? co2Data[substitutions[index] as keyof typeof co2Data] : -1
        : -1,
    }));
  }, [recipe, substitutions, setError]); // Added substitutions to dependency array

  const carbonScore = useMemo(() => {
    let count = 0;
    return Math.round(
      (Object.values(ingredientData).reduce((acc: number, curr: any) => {
        // Updated to ignore ingredients with substitutionScore of -2
        if (curr.substitution == "") return acc;
        if ((curr.substitution != null && curr.substitutionScore > -1) || curr.score != -1) count++;
        return acc + (curr.substitution != null && curr.substitutionScore > -1 ? curr.substitutionScore : curr.score == -1 ? 0 : curr.score);
      }, 0) /
        count) *
        100
    );
  }, [recipe, ingredientData]);

  const currentIngredientScore = useMemo(() => {
    if (ingredientToSubstituteIndex == -1) return -1;
    return ingredientData[ingredientToSubstituteIndex].substitutionScore != -1 ? ingredientData[ingredientToSubstituteIndex].substitutionScore : ingredientData[ingredientToSubstituteIndex].score;
  }, [ingredientData, ingredientToSubstituteIndex]);

  if (loading || isSaving) {
    return (
      <div className="bg-background min-h-screen">
        <Header />
        <LoadingSpinner />
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
          message: "Go to Recipes",
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
    setShowSubstitutes(false);
    const newSubstitutions = substitutions ? [...substitutions] : Array(ingredientData.length).fill(null);
    if (sub.name == ingredientData[index].match || sub.name == "" && ingredientData[index].substitution == "") {
      newSubstitutions[index] = null;
      ingredientData[index].substitution = null;
      ingredientData[index].substitutionScore = -1;
    } else {
      newSubstitutions[index] = sub.name;
      ingredientData[index].substitution = sub.name;
      ingredientData[index].substitutionScore = sub.score;
    }
    setRecipeSubstitutions(id || "", newSubstitutions as any);
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />

      {/* Dialog to be used for substitutions */}
      {ingredientToSubstituteIndex != -1 && (
      <Dialog open={showSubstitutes} onOpenChange={setShowSubstitutes}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-md">Substituting {ingredientData[ingredientToSubstituteIndex].name}</DialogTitle>
            <DialogDescription className="text-xs">
              Choose a more eco-friendly alternative
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {specificSubstitutions && (
              <div className="space-y-4">
                {specificSubstitutions.map((sub: any) => (
                  <div
                    key={`substitution-${sub.name}`}
                    className="flex items-center justify-between hover:bg-gray-700/10 rounded"
                  >
                    <span>{sub.name}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`${sub.score > currentIngredientScore ? "text-green-500" : "text-red-500"}`}
                      >
                        {sub.score > currentIngredientScore
                          ? "↑"
                          : "↓"}
                        {Math.round(Math.abs(
                          (sub.score  -
                            currentIngredientScore) * 100
                        ))}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => substituteIngredient(ingredientToSubstituteIndex, sub)}
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
      )}
  
      <main className="bg-emerald-800/10 mx-auto py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/recipes")}
          className="mb-6 text-gray-200 hover:text-white transition-colors"
        >
          ← Back to Recipes
        </button>

        {!isUserRecipe(id || "") && (
    <Button 
      variant="outline" 
      className="ml-auto text-gray-200 hover:text-white hover:bg-emerald-800/20 transition-colors mb-4 flex items-center gap-2" 
      onClick={async () => {
        setSaving(true);
        await saveRecipe(recipe.canonical_url || "", user);
        await refreshRecipes(); // Add this to refresh the recipes list
        setSaving(false);
      }}
      disabled={isSaving}
    >
      {isSaving ? (
        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      )}
      {isSaving ? 'Saving...' : 'Save Recipe'}
    </Button>
  )}
          </div>
        <Card className="max-w-4xl mx-auto bg-card/40 p-8 rounded-lg">
          <a
            href={recipe.canonical_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold text-white mb-2 font-display hover:text-gray-300 transition-colors flex items-start">
                {recipe.title}
                <span className="ml-4 mt-[-2px] text-gray-500 text-sm">
                  <svg
                    className="w-4 h-4 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </span>
              </h1>
              {recipe.canonical_url && (
                <span className="text-sm text-gray-400 mb-4">
                  from{" "}
                  {new URL(recipe.canonical_url).hostname.replace("www.", "")}
                </span>
              )}
            </div>
          </a>
          <div className="space-y-6">
            <img
              className="aspect-video bg-gray-700/20 rounded-lg object-cover"
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

            <div className="flex items-center space-x-4 text-gray-300">
              <span>By {recipe.author}</span>
              <span>•</span>
              <span>{recipe.cuisine} Cuisine</span>
            </div>

            <p className="text-gray-300">{recipe.description}</p>

            {recipe.carbonData && ecoClasses(carbonScore)}

            <div>
              <h2 className="text-2xl font-semibold text-white mb-3">
                Ingredients
              </h2>
              <ul className="list-disc list-inside text-gray-300">
                {ingredientData.map((ingredient, index) => (
                  <div key={`ingredient-${index}`}>
                    <li className="flex items-start space-x-2 my-1">
                      <Checkbox className="text-green-400 me-2 my-auto" />
                      <span className="self-center">
                        {ingredient.substitution === "" ? 
                          <span className="line-through text-gray-500">{ingredient.name}</span> :
                          ingredient.substitution ? 
                            `${ingredient.substitution} (substituted for ${ingredient.name})` : 
                            ingredient.name
                        }
                      </span>
                      <div className="flex-1"></div>
                      {returnSubstitutionButton(index)}
                    </li>
                    <hr className="my-1 border-white/30 border-dashed border-t" />
                  </div>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-3">
                Instructions
              </h2>
              <ol className="list-decimal list-inside text-gray-300">
                {recipe.instructions_list.map(
                  (instruction: string, index: number) => (
                    <li key={`instruction-${index}`}>{instruction}</li>
                  )
                )}
              </ol>
            </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RecipeDetail;
