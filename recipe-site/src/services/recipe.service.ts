import {
    Recipe
} from '@/types/recipe';
// import { db } from '@/utils/firebase.utils';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, getDoc, updateDoc } from 'firebase/firestore';

// This will be replaced with Firebase implementation later
const mockRecipes: Recipe[] = [{
        id: '1',
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
            ingredients: ['1 goose', '1 fish', '1 beef']
        }],
        cook_time: 30,
        site_name: 'example.com',
        ratings: 92,
        yields: '1',
        host: 'example.com',
        ingredients: ['1 goose', '1 fish', '1 beef'],
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
        }, {
            name: 'beef',
            ecoScore: 20
        }]
    },
    {
        id: '2',
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
        id: '3',
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
        id: '4',
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
        id: '5',
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
        id: '6',
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
        id: '7',
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
        id: '8',
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
        id: '9',
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
    getUserRecipes: async (userId: string): Promise < any > => {
        try {
        fetch(import.meta.env.VITE_API_ENDPOINT.concat("/recipe/user/") + userId, {
            method: 'GET',
        })
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            console.log(data);
            return data;
          })
          .catch(error => {
            console.error('Error fetching recipe:', error);
          });
        } catch (error) {
            console.error('Error fetching recipe:', error);
            throw new Error('Failed to fetch recipe');
        }
    },

    // Get a single recipe by ID
    getRecipeById: async (recipeId: string): Promise < Recipe | undefined > => {
        return mockRecipes.find(recipe => recipe.id === recipeId);
        // try {
        //     const recipesRef = doc(db, 'recipes', recipeId.toString());
        //     const recipeSnap = await getDoc(recipesRef);

        //     if (!recipeSnap.exists()) {
        //         return undefined;
        //     }

        //     return {
        //         // id: recipeSnap.id,
        //         ...recipeSnap.data()
        //      } as Recipe;

        // } catch (error) {
        //     console.error('Error fetching recipe:', error);
        //     throw new Error('Failed to fetch recipe');
        // }
    },

    // Add a new recipe
    // TODO: Decide if will every be used in production
    // addRecipe: async (userId: string, recipe: Omit < Recipe, 'id' > ): Promise < Recipe > => {
    //     try {
    //         const recipesRef = collection(db, 'recipes');
    //         const newRecipeData = {
    //             ...recipe,
    //             userId,
    //             createdAt: new Date().toISOString(),
    //             updatedAt: new Date().toISOString(),
    //         };

    //         const docRef = await addDoc(recipesRef, newRecipeData);

    //         return {
    //             id: docRef.id,
    //             ...newRecipeData
    //         };
    //     } catch (error) {
    //         console.error('Error adding recipe:', error);
    //         throw new Error('Failed to add recipe');
    //     }
    // },

    // // Delete a recipe
    // deleteRecipe: async (recipeId: number): Promise < void > => {
    //     try {
    //         const recipeRef = doc(db, 'recipes', recipeId.toString());
    //         await deleteDoc(recipeRef);
    //     } catch (error) {
    //         console.error('Error deleting recipe:', error);
    //         throw new Error('Failed to delete recipe');
    //     }
    // },

    // // Update a recipe
    // // TODO: Decide if will every be used in production
    // updateRecipe: async (recipeId: string, updates: Partial<Recipe>): Promise<Recipe> => {
    //     try {
    //         const recipeRef = doc(db, 'recipes', recipeId);
    //         const updateData = {
    //             ...updates,
    //             updatedAt: new Date().toISOString(),
    //         };

    //         await updateDoc(recipeRef, updateData);

    //         // Fetch and return the updated recipe
    //         const updatedRecipe = await getDoc(recipeRef);
    //         return {
    //             id: updatedRecipe.id,
    //             ...updatedRecipe.data()
    //         } as Recipe;
    //     } catch (error) {
    //         console.error('Error updating recipe:', error);
    //         throw new Error('Failed to update recipe');
    //     }
    // }
};
