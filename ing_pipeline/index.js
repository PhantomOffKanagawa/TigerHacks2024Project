import fs from 'fs'
import sanitizeIngredients from './parse_ingredients.js'
import getCarbonScore from './carbon_score.js'

const LAMBDA_FUNCTION_URL = 'https://scgcplb7osrk65nbxgnzp43cz40jekxj.lambda-url.us-east-2.on.aws/'

async function getCarbonScoresByURL(url) {

  const t = Date.now()
  const response = await fetch(LAMBDA_FUNCTION_URL, {
    method: 'POST',
    body: JSON.stringify({url})
  })
  console.log(`Request took ${(Date.now() - t)/1000}s`)

  let scrapedData = null
  if (response.ok) {
    scrapedData = await response.json()
    console.log(scrapedData)
  } else {
    console.warn(`${url} did not respond`)
    return
  }

  //const scrapedData = JSON.parse(fs.readFileSync('./response.json', 'utf8'));
  //const scrapedData = JSON.parse(fs.readFileSync('./chicken_response.json', 'utf8'));
  //const scrapedData = JSON.parse(fs.readFileSync('./pasta_response.json', 'utf8'));

  const { ingredients } = scrapedData

  console.log('Raw ingredients')
  console.log(ingredients)

  const sanitized = sanitizeIngredients(ingredients)

  console.log('Sanitized ingredients')
  console.log(sanitized)

  const carbonData = sanitized.map(ingredient => ({ingredient, carbonScore: getCarbonScore(ingredient)}))
  console.log(carbonData)

  
}


getCarbonScoresByURL('https://pinchofyum.com/the-best-soft-chocolate-chip-cookies')



export {}


