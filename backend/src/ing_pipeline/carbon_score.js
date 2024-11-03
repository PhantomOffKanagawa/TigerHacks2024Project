import fs from 'fs'
import Fuse from 'fuse.js'

const co2_data = JSON.parse(fs.readFileSync('public/co2_data.json', 'utf8'))
const foods = Object.keys(co2_data)

function countMatchingWords(text, reference) {
  // Convert both strings to lowercase and split into words
  if (!text) return 0
  const textWords = text.toLowerCase().split(/\s+/)
  const referenceWords = new Set(reference.toLowerCase().split(/\s+/)) // Use a Set for efficient lookup

  // Count words in `textWords` that appear in `referenceWords`
  let count = 0
  for (const word of textWords) {
    if (referenceWords.has(word)) {
      count++
    }
  }

  return count
}

export default function getCO2ByIngredient(ing) {
  // console.log(`Searching ingredient ${ing}`)
  const tallies = foods
    .map((food) => ({ food, matches: countMatchingWords(ing, food) }))
    .sort((a, b) => b.matches - a.matches)
  const val = tallies[0].matches
  if (val === 0) {
    // console.log(ing + ' not found!')
    return [-1, 'NONE']
  }
  const maxes = [tallies[0]]
  for (let i = 1; i < tallies.length; i++) {
    if (tallies[i].matches === val) {
      maxes.push(tallies[i])
    }
  }
  //console.log(`Maxes: ${maxes.map(JSON.stringify)}`)
  let exactMatch = null
  for (let match of maxes) {
    if (ing === match.food.toLowerCase()) {
      // If exact match
      //console.log(`Exact match with ${match.food}`)
      exactMatch = match.food
      break
    }
  }
  if (exactMatch === null) {
    // Fuzzy search for best option
    const fuse = new Fuse(
      maxes.map((m) => m.food),
      {
        includeScore: true,
      },
    )
    const result = fuse.search(ing)
    if (!result.length) {
      //console.log(`${ing} has no results... using ${maxes[0].food}`)
      return [co2_data[maxes[0].food], maxes[0].food]
    }
    const { item, score } = result[0]
    //console.log(`Best fuzzy search result is ${item} with score ${score}`)
    //console.log(`${item} has co2 emissions of ${co2_data[item]}`)
    return [co2_data[item], item]
  } else {
    //console.log(`${exactMatch} has co2 emissions of ${co2_data[exactMatch]}`)
    return [co2_data[exactMatch], exactMatch]
  }
}
