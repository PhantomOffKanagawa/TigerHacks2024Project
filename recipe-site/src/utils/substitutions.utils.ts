type FoodItem = {
  name: string;
  score: number;
}

import { substitutions } from "@/data/substitutions";
import { co2Data } from "@/data/co2_data";
  
  export function getSubstitutions(ingredientName: string, currentSubstitution?: string): FoodItem[] {
    // Normalize the ingredient name for lookup
    const normalizedName = ingredientName.trim().toLowerCase();
    
    // Find the original ingredient in the database
    const originalItem = Object.keys(co2Data).find(
      item => item.toLowerCase() === normalizedName
    );
    
    if (!originalItem) return [];
    
    // Get possible substitutions from the map
    let substitutes = substitutions[originalItem] || [];
    
    // Remove the current substitution from the list if it exists
    if (currentSubstitution && substitutes.includes(currentSubstitution)) {
      substitutes = substitutes.filter(sub => sub !== currentSubstitution);
    }

    // Add the original item back to the list if currently substituted
    if (currentSubstitution) {
      substitutes.unshift(originalItem);
    }

    // Return the substitute items with their eco scores
    return substitutes
      .map(subName => ({ name: subName, score: co2Data[subName as keyof typeof co2Data] }))
      .filter((item): item is FoodItem => item !== undefined)
      // Sort by eco score (highest first)
      .sort((a, b) => b.score - a.score);
  }

  export function hasSubstitutions(ingredientName: string): boolean {
    const normalizedName = ingredientName.trim().toUpperCase();
    console.log(normalizedName);
    const originalItem = Object.keys(co2Data).find(
      item => item.toUpperCase() === normalizedName
    );
    
    return originalItem ? substitutions[originalItem]?.length > 0 : false;
  }