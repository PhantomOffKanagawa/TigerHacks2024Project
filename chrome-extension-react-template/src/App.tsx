import { useEffect, useMemo, useState } from 'react'
import smartTruncate from 'smart-truncate'
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
import { Recipe } from './types/recipe'
import IngredientScoreBar from './components/ui/IngredientScoreBar'
import Auth from './components/Auth.tsx'
import { useAuth } from './contexts/AuthContext.tsx'
import SignOutButton from './components/SignOutButton.tsx'
import websiteData from './websites.json'
import { User } from 'firebase/auth'

// let first = true

const sampleRecipe: Recipe = {
  id: 0,
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
  carbonData: {
    Loading: { emissions: 0.0, score: 0 },
    Loading2: { emissions: 0.0, score: 0 },
  },
}

function App() {
  const [currentUrl, setCurrentUrl] = useState('')
  const [recipe, setRecipe] = useState(sampleRecipe)
  const { user } = useAuth()
  const validUrls = websiteData.websites
  const [saved, setSaved] = useState('Save Recipe');
  const [id, setId] = useState('');

  async function saveRecipe(currentUrl: string, user: User){
    console.log(currentUrl)
        console.log(user.uid)
        const response = await fetch('https://leangreen.club/api/recipes/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: currentUrl,
            userId: user.uid
          }),
        })
        if (response.ok) {
          const data = await response.json()
          console.log("SAVE")
          console.log(data)
          if (data['recipeId']) {
            setId(data['recipeId'])
          } else {
            console.error('no recipe returned')
          }
        } else {
          console.error('Error fetching recipes', response.status)
        }
      setSaved('Saved!')
  } 
  
  useEffect(() => {
    // Query the active tab and get its URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setCurrentUrl(tabs[0].url ?? '')
      }
    })
  }, [])
  const isUrl = validUrls.some((url) => currentUrl?.includes(url) ?? false)
  const ecoScore = useMemo(
    () => 100 * (recipe.averageCarbonScore ?? 0),
    [recipe?.averageCarbonScore],
  )
  const truncatedDescription = useMemo(
    () => smartTruncate(recipe.description, 120),
    [recipe?.description],
  )

  useEffect(() => {
    if (validUrls.some((url) => currentUrl?.includes(url)) && user) {
      ;(async function () {
        console.log(currentUrl)
        console.log(user.uid)
        const response = await fetch('https://leangreen.club/api/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: currentUrl,
          }),
        })
        if (response.ok) {
          const data = await response.json()
          console.log("FETCHED")
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

  console.log(recipe.averageCarbonScore)
  return (
    <Card className='w-[400px] rounded-none p-0 border-0 shadow-none bg-emerald-900'>
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
              {truncatedDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='-mt-7'>
              <GaugeComponent value={Math.round(ecoScore)} />
            </div>
            <div className='mt-1 space-y-2'>
              <div className='text-sm'>
                <span className='font-semibold mb-2 block text-white'>
                  Ingredient Scores:
                </span>
                {Object.entries(recipe.carbonData)
                  .sort(([, a], [, b]) => a.score - b.score)
                  .filter(([, a]) => a.score !== -1) // Filter out -1 scores
                  .slice(0, 5) // Take top 5
                  .map(([key], index) => (
                    <IngredientScoreBar
                      key={index}
                      name={smartTruncate(key, 35)}
                      score={Math.round(recipe.carbonData[key].score * 100)}
                    />
                  ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex justify-between'>
<<<<<<< HEAD
            <Button
              onClick={() => saveRecipe(currentUrl, user)}
              className='bg-emerald-700 text-white p-2 rounded-md w-25 self-center hover:bg-emerald-900'
            >
              <a
                className='text-white'
                href={'https://leangreen.club/recipes/' + recipe.id}
                target='_blank'
              >
                View Details
              </a>
=======
            <Button 
              disabled={saved !== 'Saved!'} 
              onClick={() => saveRecipe(currentUrl, user)} 
              className='bg-emerald-700 text-white p-2 rounded-md w-25 self-center hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <a className='text-white' href={"https://leangreen.club/recipes/" + id} target='_blank'>View Details</a>
>>>>>>> 01920da1858e526fa886ea77e506a6612b46cb52
            </Button>
            <Button
              onClick={() => saveRecipe(currentUrl, user)}
              className='bg-emerald-700 text-white p-2 rounded-md w-25 self-center hover:bg-emerald-900'
            >
              {saved}
            </Button>
            <SignOutButton />
          </CardFooter>
        </>
      )}
    </Card>
  )
}

export default App
