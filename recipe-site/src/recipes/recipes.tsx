
import { FC } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from 'components/ui/skeleton';

import { Recipe } from '@/types/recipe';
import { Link } from 'react-router-dom';

const recipes: Recipe[] = [
  {
    id: 1,
    title: 'Vegetarian Lasagna',
    image: 'https://example.com/lasagna.jpg',
    prep_time: 30,
    author: 'John Doe',
    cuisine: 'Italian',
    description: 'A delicious plant-based version of the classic Italian dish',
    language: 'English',
    instructions: 'make pasta, cook pasta',
    instructions_list: ['make pasta', 'cook pasta'],
    ingredient_groups: [{purpose: null, ingredients: ['1 cup pasta', '1 cup tomato sauce']}],
    cook_time: 30,
    site_name: 'example.com',
    ratings: 92,
    yields: '1',
    host: 'example.com',
    ingredients: ['1 cup pasta', '1 cup tomato sauce'],
    category: 'main',
    ratings_count: 100,
    total_time: 60,
    ecoScore: 20,
    rating: 3,
    sanitizedIngredients: [{name: 'pasta', score: 20}, {name: 'tomato sauce', score: 20}]
  },
  {
    id: 2,
    title: 'Vegetarian Lasagna',
    image: 'https://example.com/lasagna.jpg',
    prep_time: 30,
    author: 'John Doe',
    cuisine: 'Italian',
    description: 'A delicious plant-based version of the classic Italian dish',
    language: 'English',
    instructions: 'make pasta, cook pasta',
    instructions_list: ['make pasta', 'cook pasta'],
    ingredient_groups: [{purpose: null, ingredients: ['1 cup pasta', '1 cup tomato sauce']}],
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
    sanitizedIngredients: [{name: 'pasta', score: 20}, {name: 'tomato sauce', score: 20}]
  },
  {
    id: 3,
    title: 'Vegetarian Lasagna',
    image: 'https://example.com/lasagna.jpg',
    prep_time: 30,
    author: 'John Doe',
    cuisine: 'Italian',
    description: 'A delicious plant-based version of the classic Italian dish',
    language: 'English',
    instructions: 'make pasta, cook pasta',
    instructions_list: ['make pasta', 'cook pasta'],
    ingredient_groups: [{purpose: null, ingredients: ['1 cup pasta', '1 cup tomato sauce']}],
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
    sanitizedIngredients: [{name: 'pasta', score: 20}, {name: 'tomato sauce', score: 20}]
  }
];

const RecipeList: FC = () => {
  return (
    <div className="bg-gray-800">
    <div className="max-w-7xl mx-auto py-12 px-6 bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-8">Recipes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Card key={recipe.canonical_url} className="bg-gray-800 p-6 rounded-lg">
            <Skeleton className="bg-gray-700 w-full h-[150px] rounded-lg" />
            <div className="space-y-4 py-2">
              <Link to={`/recipes/${recipe.id}`}>
                <h2 className="text-xl font-semibold text-white">{recipe.title}</h2>
              </Link>
              <p className="text-gray-400">{recipe.description}</p>
              <div className="flex justify-between items-center">
                {recipe.ecoScore && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Eco Score</span>
                    <span className="text-green-400">{recipe.ecoScore}</span>
                  </div>
                )}
                {recipe.rating && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Rating</span>
                    <span className="text-blue-400">{recipe.rating}/5</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeList;
