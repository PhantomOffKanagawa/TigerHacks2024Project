import { useEffect, useState } from 'react'
import './App.css'
import GaugeComponent from './Gauge'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Recipe } from './types/recipe'
import IngredientScoreBar from './components/ui/IngredientScoreBar'
import Auth from "./components/Auth.tsx";
import {useAuth} from "./contexts/AuthContext.tsx";
import SignOutButton from "./components/SignOutButton.tsx";


const sampleRecipe: Recipe = {
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
}

function App() {

  
  const [currentUrl, setCurrentUrl] = useState('');
  const [recipe] = useState<Recipe>(sampleRecipe);
  const { user } = useAuth();

  useEffect(() => {
    // Query the active tab and get its URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            setCurrentUrl(tabs[0].url  ?? '');
        }
    });
  }, []);

  return (
    <Card className="w-[350px] p-0 rounded-none bg-emerald-900">
      
      {user ? (
        <>
          <CardHeader>
            <CardTitle className="text-white">{recipe.title}</CardTitle>
            <CardDescription className="text-gray-300">{recipe.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <GaugeComponent value={recipe.ecoScore || 0} />
            <div className="mt-4 space-y-2">
              <div className="text-sm">
              <span className="font-semibold mb-2 block text-white">Ingredient Scores:</span>
                {recipe.sanitizedIngredients.map((ingredient, index) => (
                  <IngredientScoreBar
                    key={index}
                    name={ingredient.name}
                    score={ingredient.score}
                  />
                ))}
              </div>
              <div className="text-sm text-white">
                <span className="font-semibold">Rating:</span> {recipe.rating}/5
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button className="bg-emerald-700 text-white p-2 rounded-md w-25 self-center hover:bg-emerald-900">View Details</Button>
            <Button className="bg-emerald-700 text-white p-2 rounded-md w-25 self-center hover:bg-emerald-900">Save Recipe</Button>
            <SignOutButton />
          </CardFooter>
        </>
      ) : (
          <div>
            <Auth />
          </div>
      )
      }
    </Card>
  )
}

export default App