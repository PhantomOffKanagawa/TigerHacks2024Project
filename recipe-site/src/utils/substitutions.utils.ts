interface FoodItem {
    name: string;
    ecoScore: number;
  }
  
  interface SubstitutionMap {
    [key: string]: string[];
  }
  
  // Base food items with their eco scores
  export const foodDatabase: FoodItem[] = [
    // Proteins
    { name: "Beef", ecoScore: 20 },
    { name: "Chicken", ecoScore: 40 },
    { name: "Pork", ecoScore: 35 },
    { name: "Tofu", ecoScore: 85 },
    { name: "Tempeh", ecoScore: 80 },
    { name: "Seitan", ecoScore: 75 },
    
    // Dairy
    { name: "Milk", ecoScore: 30 },
    { name: "Almond Milk", ecoScore: 60 },
    { name: "Oat Milk", ecoScore: 80 },
    { name: "Butter", ecoScore: 35 },
    { name: "Coconut Oil", ecoScore: 65 },
    
    // Common ingredients
    { name: "Eggs", ecoScore: 45 },
    { name: "Flax Seeds", ecoScore: 75 },
    { name: "Chia Seeds", ecoScore: 70 }
  ];
  
  // Mapping of ingredients to their possible substitutions
  export const substitutionMap: SubstitutionMap = {
    "Beef": ["Tofu", "Tempeh", "Seitan"],
    "Chicken": ["Tofu", "Tempeh", "Seitan"],
    "Pork": ["Tofu", "Tempeh", "Seitan"],
    "Milk": ["Almond Milk", "Oat Milk"],
    "Butter": ["Coconut Oil"],
    "Eggs": ["Flax Seeds", "Chia Seeds"],
  };
  
  export function getSubstitutions(ingredientName: string): FoodItem[] {
    // Normalize the ingredient name for lookup
    const normalizedName = ingredientName.trim().toLowerCase();
    
    // Find the original ingredient in the database
    const originalItem = foodDatabase.find(
      item => item.name.toLowerCase() === normalizedName
    );
    
    if (!originalItem) return [];
    
    // Get possible substitutions from the map
    const substitutes = substitutionMap[originalItem.name] || [];
    
    // Return the substitute items with their eco scores
    return substitutes
      .map(subName => foodDatabase.find(item => item.name === subName))
      .filter((item): item is FoodItem => item !== undefined)
      // Sort by eco score (highest first)
      .sort((a, b) => b.ecoScore - a.ecoScore);
  }

  export function hasSubstitutions(ingredientName: string): boolean {
    const normalizedName = ingredientName.trim().toLowerCase();
    const originalItem = foodDatabase.find(
      item => item.name.toLowerCase() === normalizedName
    );
    
    return originalItem ? substitutionMap[originalItem.name]?.length > 0 : false;
  }