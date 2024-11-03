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
import TreeComponent from './components/TreeComponent.tsx'

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
  const [saved, setSaved] = useState('Save Recipe')
  const [id, setId] = useState('')
  const [treeGrowth, setTreeGrowth] = useState(20) // Start at minimum size

  // Calculate growth change based on recipe carbon score
  const calculateGrowthChange = (carbonScore: number) => {
    const baseScore = 0.5 // Threshold for positive/negative growth
    const growthFactor = 5 // How much each score affects growth
    return (carbonScore - baseScore) * growthFactor
  }

  // Update tree growth with limits and persistence
  const updateTreeGrowth = (change: number) => {
    setTreeGrowth(prev => {
      const newGrowth = Math.min(100, Math.max(20, prev + change))
      // Store in chrome storage
      if (!import.meta.env.DEV) {
        chrome.storage.sync.set({ treeGrowth: newGrowth })
      }
      return newGrowth
    })
  }

  // Load initial tree growth from storage
  useEffect(() => {
    if (!import.meta.env.DEV) {
      chrome.storage.sync.get(['treeGrowth'], (result) => {
        if (result.treeGrowth) {
          setTreeGrowth(result.treeGrowth)
        }
      })
    }
  }, [])

  const [isLoading, setIsLoading] = useState(true)

  async function saveRecipe(currentUrl: string, user: User) {
    console.log(currentUrl)
    console.log(user.uid)
    setSaved('Saving...')
    const response = await fetch(
      import.meta.env.VITE_API_ENDPOINT.concat('/recipes/save'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: currentUrl,
          userId: user.uid,
        }),
      },
    )
    if (response.ok) {
      const data = await response.json()
      console.log('SAVE')
      console.log(data)
      if (data['recipeId']) {
        setId(data['recipeId'])

        // Update tree growth based on recipe's carbon score
        const growthChange = calculateGrowthChange(recipe.averageCarbonScore ?? 0)
        updateTreeGrowth(growthChange)
      } else {
        console.error('no recipe returned')
      }
    } else {
      console.error('Error fetching recipes', response.status)
    }
    setSaved('Saved!')
  }

  useEffect(() => {
    if (!import.meta.env.DEV) {
      // Query the active tab and get its URL
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          setCurrentUrl(tabs[0].url ?? '')
        }
      })
    }
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
      setIsLoading(true)
      ;(async function () {
        console.log(currentUrl)
        console.log(user.uid)
        const response = await fetch(
          import.meta.env.VITE_API_ENDPOINT.concat('/recipes'),
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: currentUrl,
            }),
          },
        )
        if (response.ok) {
          const data = await response.json()
          console.log('FETCHED')
          console.log(data)
          if (data['recipe']) {
            setRecipe(data['recipe'])
          } else {
            console.error('no recipe returned')
          }
        } else {
          console.error('Error fetching recipes', response.status)
        }
        setIsLoading(false)
      })()
    }
  }, [currentUrl, validUrls, user])

  // For testing growth developments
  // setTimeout(() => {
  //   const growthChange = calculateGrowthChange(0.55 ?? 0)
  //   updateTreeGrowth(growthChange)
  //   // setTreeGrowth(20)
  // }, 1000)

  console.log(recipe.averageCarbonScore)
  return (
    <Card className='w-[400px] h-[600px] overflow-hidden relative rounded-none p-0 border-0 shadow-none bg-background'>
      {!user ? (
        <div>
          <Auth />
        </div>
      ) : !isUrl ? (
        <>
          <div className="absolute top-2 right-2 z-10">
            <SignOutButton className="h-8 w-8 p-0" />
          </div>
          <CardContent className='pb-2'>
            <div className='text-white rounded-none h-[600px] text-center flex items-center flex-col justify-center'>
            <p className='text-white text-center text-lg font-semibold' style={{marginTop: '25px'}}>
                No Recipe Found
              </p>
              <div className="flex-1"></div>
              <TreeComponent growth={treeGrowth} />
            </div>
          </CardContent>
        </>
      ) : isLoading ? (
        <>
          <div className="absolute top-2 right-2 z-10">
            <SignOutButton className="h-8 w-8 p-0" />
          </div>
          <CardHeader>
            <div className='mx-auto h-6 w-3/4 bg-primary-700 animate-pulse rounded'></div>
            <div className='h-16 w-full bg-primary-700 animate-pulse rounded mt-2'></div>
          </CardHeader>
          <CardContent>
            <div className='-mt-7 flex justify-center'>
              <div className='h-36 w-[80%] mt-4 mb-1 bg-primary-700 animate-pulse rounded-t-full'></div>
            </div>
            <div className='mt-1 space-y-2'>
              <div className='text-sm'>
                <div className='mx-auto h-5 w-32 bg-primary-700 animate-pulse rounded mb-2'></div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className='h-8 w-full bg-primary-700 animate-pulse rounded mb-2'></div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className='absolute bottom-0 flex justify-between w-full'>
            <div className='w-[150px] h-10 bg-primary-700 animate-pulse rounded'></div>
            <div className='w-[150px] h-10 bg-primary-700 animate-pulse rounded'></div>
          </CardFooter>
        </>
      ) : (
        <>
          <div className="absolute top-2 right-2 z-10">
            <SignOutButton className="h-8 w-8 p-0" />
          </div>
          <CardHeader>
            <CardTitle className='text-white text-base'>
              {recipe.title}
            </CardTitle>
            <CardDescription className='text-gray-300 text-xs'>
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
                      name={smartTruncate(key, 30)}
                      score={Math.round(recipe.carbonData[key].score * 100)}
                    />
                  ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className='absolute bottom-0 flex justify-between w-full'>
            <Button
              disabled={saved !== 'Saved!' || !id}
              onClick={() => saveRecipe(currentUrl, user)}
              className='w-[150px] bg-emerald-700 text-white p-2 rounded-md self-center hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <a
                className='text-white'
                href={'https://leangreen.club/recipes/' + id}
                target='_blank'
              >
                View Details
              </a>
            </Button>
            <Button
              disabled={isLoading || saved === 'Saving...' || saved === 'Saved!'}
              onClick={() => saveRecipe(currentUrl, user)}
              className='w-[150px] bg-emerald-700 text-white p-2 rounded-md self-center hover:bg-emerald-900'
            >
              {saved}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}

export default App
