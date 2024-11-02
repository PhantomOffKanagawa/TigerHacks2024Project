import fs from 'fs'
import sanitizeIngredients from './parse_ingredients.js'
import getCarbonScore from './carbon_score.js'

const LAMBDA_FUNCTION_URL = 'https://scgcplb7osrk65nbxgnzp43cz40jekxj.lambda-url.us-east-2.on.aws/'
const MAX_EMISSIONS = 78.80
const SIGMOID_STEEPNESS = 1
const SIGMOID_MIDPOINT = 10

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
    //console.log(scrapedData)
  } else {
    console.warn(`${url} did not respond`)
    return
  }

  const { ingredients } = scrapedData

  //console.log('Raw ingredients')
  //console.log(ingredients)

  const sanitized = sanitizeIngredients(ingredients)

  //console.log('Sanitized ingredients')
  //console.log(sanitized)
  //sanitized.push('lamb meat')

  const carbonData = sanitized.reduce((acc, curr) => {
    acc[curr] = {emissions: getCarbonScore(curr)}
    return acc
  }, {})
  //const carbonData = sanitized.map(ingredient => ({[ingredient]: {carbonScore: getCarbonScore(ingredient)}}))

  //const carbonData = sanitized
  //console.log(carbonData
  //const scores = carbonData.map((k, v) => ({[k]: Math.max(0, 1 - Math.log(v + 1) / Math.log(MAX_EMISSIONS + 1))}))
  for (let ing in carbonData) {
    //console.log(carbonData[ing])
    const em = carbonData[ing]['emissions']
    const score = em !== -1 ? Math.exp(-em / 9) : -1
    //const score = 1 / (1 + Math.exp((totalEmissions - SIGMOID_MIDPOINT) / SIGMOID_STEEPNESS));
    //const score = Math.max(0, 1 - Math.log(carbonData[ing]['emissions'] + 1) / Math.log(MAX_EMISSIONS + 1))
    carbonData[ing]['score'] = score

  }
  //console.log(carbonData)
  const withoutUnknown = Object.keys(carbonData).reduce((acc, curr) => {
    if (carbonData[curr]['emissions'] !== -1) {
      acc[curr] = carbonData[curr]
    }
    return acc
  }, {})
  const sum = Object.values(withoutUnknown).reduce((acc, curr) => acc += curr['score'], 0)
  //console.log(`Total score: ${sum}`)
  const avg = sum / Object.keys(withoutUnknown).length
  console.log(`Average score: ${avg}`)
  return [carbonData, avg]
}


async function test() {
  const [carbonData, avg] = await getCarbonScoresByURL('https://pinchofyum.com/the-best-soft-chocolate-chip-cookies')
  console.log(carbonData)
  console.log(avg)

}

test()

export {}


