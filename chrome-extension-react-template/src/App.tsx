import { useEffect, useState } from 'react'
import './App.css'
import GaugeComponent from './Gauge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RecipeData } from './types/recipe'
// import IngredientScoreBar from './components/ui/IngredientScoreBar'
import Auth from './components/Auth.tsx'
import { useAuth } from './contexts/AuthContext.tsx'
import SignOutButton from './components/SignOutButton.tsx'
import websiteData from './websites.json'

// let first = true

const sampleRecipe: RecipeData = {
  title: 'Loading...',
  image: 'https://example.com/lasagna.jpg',
  prep_time: 0,
  author: 'John Doe',
  cuisine: 'Italian',
  description: 'Loading',
  language: 'English',
  instructions: 'Loading',
  instructions_list: ['Loading', 'Loading'],
  ingredient_groups: [{ purpose: null, ingredients: ['Loading', 'Loading'] }],
  cook_time: 0,
  site_name: 'example.com',
  ratings_count: 0,
  yields: '0',
  host: 'example.com',
  ingredients: ['Loading', 'Loading'],
  category: 'main',
  total_time: 0,
  ecoScore: 0,
  ratings: 0,
  sanitizedIngredients: [
    { name: 'Loading', score: 0 },
    { name: 'Loading', score: 0 },
  ],
}

function App() {
  const [currentUrl, setCurrentUrl] = useState('')
  const [recipe, setRecipe] = useState(sampleRecipe)
  const { user } = useAuth()
  const validUrls = websiteData.websites

  useEffect(() => {
    // Query the active tab and get its URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setCurrentUrl(tabs[0].url ?? '')
      }
    })
  }, [])
  const isUrl = validUrls.some((url) => currentUrl?.includes(url) ?? false)

  useEffect(() => {
    if (validUrls.some((url) => currentUrl?.includes(url)) && user) {
      ;(async function () {
        console.log(currentUrl)
        console.log(user.uid)
        const response = await fetch('http://localhost:3000/api/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: currentUrl,
            userId: user.uid,
          }),
        })
        if (response.ok) {
          const data = await response.json()
          console.log(data)
          if (data['recipe']) {
            setRecipe(data['recipe'])
          } else {
            console.error('no recipe returned')
          }
        } else {
          console.error('Error fetching recipes', response.status)
        }
      })()
    }
  }, [currentUrl, validUrls, user])

  // if (isUrl && first) {
  //   fetch(
  //     'https://scgcplb7osrk65nbxgnzp43cz40jekxj.lambda-url.us-east-2.on.aws/',
  //     {
  //       method: 'POST',
  //       body: JSON.stringify({
  //         url: currentUrl,
  //       }),
  //     },
  //   )
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw new Error(`HTTP error! status: ${res.status}`)
  //       }
  //       return res.json()
  //     })
  //     .then((data) => {
  //       console.log(data)
  //       first = false
  //       setRecipe(data)
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching recipe:', error)
  //     })
  // }

  return (
    <Card className='w-[350px] rounded-none p-0 border-0 shadow-none bg-emerald-900'>
      {!isUrl ? (
        <CardContent className='pb-2'>
          <div className='text-white rounded-none text-center h-[100px] flex items-center justify-center'>
            <p className='text-white text-center text-lg font-semibold'>
              No Recipe Found
            </p>
          </div>
        </CardContent>
      ) : !user ? (
        <div>
          <Auth />
        </div>
      ) : (
        <>
          <CardHeader>
            <CardTitle className='text-white'>{recipe.title}</CardTitle>
            <CardDescription className='text-gray-300'>
              {recipe.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GaugeComponent value={recipe.ecoScore || 0} />
            <div className='mt-4 space-y-2'>
              <div className='text-sm'>
                <span className='font-semibold mb-2 block text-white'>
                  Ingredient Scores:
                </span>
                {/* {recipe.sanitizedIngredients.map((ingredient, index) => (
                  <IngredientScoreBar
                    key={index}
                    name={ingredient.name}
                    score={ingredient.score}
                  />
                ))} */}
              </div>
              <div className='text-sm text-white'>
                <span className='font-semibold'>Rating:</span> {recipe.ratings}
                /5
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button className='bg-emerald-700 text-white p-2 rounded-md w-25 self-center hover:bg-emerald-900'>
              View Details
            </Button>
            <Button className='bg-emerald-700 text-white p-2 rounded-md w-25 self-center hover:bg-emerald-900'>
              Save Recipe
            </Button>
            <SignOutButton />
          </CardFooter>
        </>
      )}
    </Card>
  )
}

export default App
