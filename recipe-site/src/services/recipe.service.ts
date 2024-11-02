import {
    Recipe
} from '@/types/recipe';

// This will be replaced with Firebase implementation later
const mockRecipes: Recipe[] = [{
        id: 1,
        title: 'Red Herring 1',
        image: 'https://example.com/red-herring.jpg',
        prep_time: 30,
        author: 'John Doe',
        cuisine: 'Innocuous',
        description: 'A suspiciously innocuous recipe with no discernible meaning',
        language: 'English',
        instructions: 'chase down goose, cook fish',
        instructions_list: ['chase down goose', 'cook fish'],
        ingredient_groups: [{
            purpose: null,
            ingredients: ['1 goose', '1 fish']
        }],
        cook_time: 30,
        site_name: 'example.com',
        ratings: 92,
        yields: '1',
        host: 'example.com',
        ingredients: ['1 goose', '1 fish'],
        category: 'main',
        ratings_count: 100,
        total_time: 60,
        ecoScore: 20,
        rating: 3,
        sanitizedIngredients: [{
            name: 'goose',
            ecoScore: 20
        }, {
            name: 'fish',
            ecoScore: 60
        }]
    },
    {
        id: 2,
        title: 'Vegetarian Lasagna 2',
        image: 'https://example.com/lasagna.jpg',
        prep_time: 30,
        author: 'John Doe',
        cuisine: 'Italian',
        description: 'A delicious plant-based version of the classic Italian dish',
        language: 'English',
        instructions: 'make pasta, cook pasta',
        instructions_list: ['make pasta', 'cook pasta'],
        ingredient_groups: [{
            purpose: null,
            ingredients: ['1 cup pasta', '1 cup tomato sauce']
        }],
        cook_time: 30,
        site_name: 'example.com',
        ratings: 92,
        yields: '1',
        host: 'example.com',
        ingredients: ['1 cup pasta', '1 cup tomato sauce'],
        category: 'main',
        ratings_count: 100,
        total_time: 60,
        ecoScore: 48,
        rating: 2,
        sanitizedIngredients: [{
            name: 'pasta',
            ecoScore: 20
        }, {
            name: 'tomato sauce',
            ecoScore: 20
        }]
    },
    {
        id: 3,
        title: 'Vegetarian Lasagna 3',
        image: 'https://example.com/lasagna.jpg',
        prep_time: 30,
        author: 'John Doe',
        cuisine: 'Italian',
        description: 'A delicious plant-based version of the classic Italian dish',
        language: 'English',
        instructions: 'make pasta, cook pasta',
        instructions_list: ['make pasta', 'cook pasta'],
        ingredient_groups: [{
            purpose: null,
            ingredients: ['1 cup pasta', '1 cup tomato sauce']
        }],
        cook_time: 30,
        site_name: 'example.com',
        ratings: 92,
        yields: '1',
        host: 'example.com',
        ingredients: ['1 cup pasta', '1 cup tomato sauce'],
        category: 'main',
        ratings_count: 100,
        total_time: 60,
        ecoScore: 98,
        rating: 4,
        sanitizedIngredients: [{
            name: 'pasta',
            ecoScore: 20
        }, {
            name: 'tomato sauce',
            ecoScore: 20
        }]
    },
    {
        id: 4,
        title: 'Vegetarian Lasagna 4',
        image: 'https://example.com/lasagna.jpg',
        prep_time: 30,
        author: 'John Doe',
        cuisine: 'Italian',
        description: 'A delicious plant-based version of the classic Italian dish',
        language: 'English',
        instructions: 'make pasta, cook pasta',
        instructions_list: ['make pasta', 'cook pasta'],
        ingredient_groups: [{
            purpose: null,
            ingredients: ['1 cup pasta', '1 cup tomato sauce']
        }],
        cook_time: 30,
        site_name: 'example.com',
        ratings: 92,
        yields: '1',
        host: 'example.com',
        ingredients: ['1 cup pasta', '1 cup tomato sauce'],
        category: 'main',
        ratings_count: 100,
        total_time: 60,
        ecoScore: 98,
        rating: 4,
        sanitizedIngredients: [{
            name: 'pasta',
            ecoScore: 20
        }, {
            name: 'tomato sauce',
            ecoScore: 20
        }]
    },
    {
        id: 5,
        title: 'Vegetarian Lasagna 5',
        image: 'https://example.com/lasagna.jpg',
        prep_time: 30,
        author: 'John Doe',
        cuisine: 'Italian',
        description: 'A delicious plant-based version of the classic Italian dish',
        language: 'English',
        instructions: 'make pasta, cook pasta',
        instructions_list: ['make pasta', 'cook pasta'],
        ingredient_groups: [{
            purpose: null,
            ingredients: ['1 cup pasta', '1 cup tomato sauce']
        }],
        cook_time: 30,
        site_name: 'example.com',
        ratings: 92,
        yields: '1',
        host: 'example.com',
        ingredients: ['1 cup pasta', '1 cup tomato sauce'],
        category: 'main',
        ratings_count: 100,
        total_time: 60,
        ecoScore: 98,
        rating: 4,
        sanitizedIngredients: [{
            name: 'pasta',
            ecoScore: 20
        }, {
            name: 'tomato sauce',
            ecoScore: 20
        }]
    },
    {
        id: 6,
        title: 'Vegetarian Lasagna 6',
        image: 'https://example.com/lasagna.jpg',
        prep_time: 30,
        author: 'John Doe',
        cuisine: 'Italian',
        description: 'A delicious plant-based version of the classic Italian dish',
        language: 'English',
        instructions: 'make pasta, cook pasta',
        instructions_list: ['make pasta', 'cook pasta'],
        ingredient_groups: [{
            purpose: null,
            ingredients: ['1 cup pasta', '1 cup tomato sauce']
        }],
        cook_time: 30,
        site_name: 'example.com',
        ratings: 92,
        yields: '1',
        host: 'example.com',
        ingredients: ['1 cup pasta', '1 cup tomato sauce'],
        category: 'main',
        ratings_count: 100,
        total_time: 60,
        ecoScore: 98,
        rating: 4,
        sanitizedIngredients: [{
            name: 'pasta',
            ecoScore: 20
        }, {
            name: 'tomato sauce',
            ecoScore: 20
        }]
    },
    {
        id: 7,
        title: 'Vegetarian Lasagna 7',
        image: 'https://example.com/lasagna.jpg',
        prep_time: 30,
        author: 'John Doe',
        cuisine: 'Italian',
        description: 'A delicious plant-based version of the classic Italian dish',
        language: 'English',
        instructions: 'make pasta, cook pasta',
        instructions_list: ['make pasta', 'cook pasta'],
        ingredient_groups: [{
            purpose: null,
            ingredients: ['1 cup pasta', '1 cup tomato sauce']
        }],
        cook_time: 30,
        site_name: 'example.com',
        ratings: 92,
        yields: '1',
        host: 'example.com',
        ingredients: ['1 cup pasta', '1 cup tomato sauce'],
        category: 'main',
        ratings_count: 100,
        total_time: 60,
        ecoScore: 98,
        rating: 4,
        sanitizedIngredients: [{
            name: 'pasta',
            ecoScore: 20
        }, {
            name: 'tomato sauce',
            ecoScore: 20
        }]
    },
    {
        id: 8,
        title: 'Vegetarian Lasagna 8',
        image: 'https://example.com/lasagna.jpg',
        prep_time: 30,
        author: 'John Doe',
        cuisine: 'Italian',
        description: 'A delicious plant-based version of the classic Italian dish',
        language: 'English',
        instructions: 'make pasta, cook pasta',
        instructions_list: ['make pasta', 'cook pasta'],
        ingredient_groups: [{
            purpose: null,
            ingredients: ['1 cup pasta', '1 cup tomato sauce']
        }],
        cook_time: 30,
        site_name: 'example.com',
        ratings: 92,
        yields: '1',
        host: 'example.com',
        ingredients: ['1 cup pasta', '1 cup tomato sauce'],
        category: 'main',
        ratings_count: 100,
        total_time: 60,
        ecoScore: 98,
        rating: 4,
        sanitizedIngredients: [{
            name: 'pasta',
            ecoScore: 20
        }, {
            name: 'tomato sauce',
            ecoScore: 20
        }]
    },
    {
        id: 9,
        title: 'Vegetarian Lasagna 9',
        image: 'https://example.com/lasagna.jpg',
        prep_time: 30,
        author: 'John Doe',
        cuisine: 'Italian',
        description: 'A delicious plant-based version of the classic Italian dish',
        language: 'English',
        instructions: 'make pasta, cook pasta',
        instructions_list: ['make pasta', 'cook pasta'],
        ingredient_groups: [{
            purpose: null,
            ingredients: ['1 cup pasta', '1 cup tomato sauce']
        }],
        cook_time: 30,
        site_name: 'example.com',
        ratings: 92,
        yields: '1',
        host: 'example.com',
        ingredients: ['1 cup pasta', '1 cup tomato sauce'],
        category: 'main',
        ratings_count: 100,
        total_time: 60,
        ecoScore: 98,
        rating: 4,
        sanitizedIngredients: [{
            name: 'pasta',
            ecoScore: 20
        }, {
            name: 'tomato sauce',
            ecoScore: 20
        }]
    }
];

export const RecipeService = {
    // Get all recipes for a user
    getUserRecipes: async (userId: string): Promise < Recipe[] > => {
        // This will be replaced with Firebase query
        return mockRecipes;
    },

    // Get a single recipe by ID
    getRecipeById: async (recipeId: number): Promise < Recipe | undefined > => {
        // This will be replaced with Firebase query
        return mockRecipes.find((recipe) => recipe.id === recipeId);
    },

    // Add a new recipe
    addRecipe: async (userId: string, recipe: Omit < Recipe, 'id' > ): Promise < Recipe > => {
        // This will be replaced with Firebase add document
        const newRecipe = {
            ...recipe,
            id: mockRecipes.length + 1,
        };
        mockRecipes.push(newRecipe);
        return newRecipe;
    },

    // Delete a recipe
    deleteRecipe: async (recipeId: number): Promise < void > => {
        // This will be replaced with Firebase delete document
        const index = mockRecipes.findIndex((recipe) => recipe.id === recipeId);
        if (index > -1) {
            mockRecipes.splice(index, 1);
        }
    }
};