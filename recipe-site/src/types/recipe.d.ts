// src/types/recipe.d.ts

export interface Nutrients {
    sugarContent?: string;
    proteinContent?: string;
    fiberContent?: string;
    fatContent?: string;
    transFatContent?: string;
    cholesterolContent?: string;
    calories?: string;
    saturatedFatContent?: string;
    carbohydrateContent?: string;
    sodiumContent?: string;
}

export interface IngredientGroup {
    purpose?: string | null;
    ingredients: string[];
}

export interface RecipeData {
    image: string;
    instructions: string;
    keywords?: string[];
    prep_time: number;
    author: string;
    cuisine: string;
    description: string;
    language: string;
    canonical_url?: string;
    title: string;
    cooking_method?: string;
    instructions_list: string[];
    nutrients?: Nutrients;
    cook_time: number;
    site_name: string;
    ratings: number;
    yields: string;
    host: string;
    ingredients: string[];
    category: string;
    ratings_count: number;
    total_time: number;
    ingredient_groups: IngredientGroup[];
}

export interface CarbonData {
    // Emissions in kgCO2e/kg of ingredient
    emissions: number;
    // Carbon score of ingredient normalized to 100
    score: number;
    // Name of the ingredient in the database
    match: string;
}

export interface Recipe extends RecipeData {
    id: string;
    carbonData: { [key: string]: CarbonData };
    averageCarbonScore: number;
    sanitizedIngredients: string[];
}

export type Substitutions = string[];