import fs from 'fs'
import Fuse from 'fuse.js'

function simplifyIngredient(ingredient) {
  // Remove content inside parentheses or any text following an unmatched opening parenthesis
  let cleaned = ingredient.replace(/\(.*?\)|\(.*$/g, '')

  // Remove measurements and quantities (e.g., "1 1/2 cups", "6.75 ounces", etc.)
  cleaned = cleaned.replace(
    /\b\d+([\/.\d]*)?\s*(cups?|tbsp|tsp|tablespoon(s)?|teaspoon(s)?|ounce(s)?|gram(s)?|milliliters?|liter(s)?|pinch(es)?|dash(es)?|jar(s)?|pound(s)?|lb(s)?|kg(s)?|gram(s)?|g|ml|oz)\b/gi,
    '',
  )
  cleaned = cleaned.replace(/\b(fresh|sliced)\b/gi, '').replace(/\s{2,}/g, ' ')
  cleaned = cleaned
    .replace(/[\d¼½¾⅓⅔⅛⅜⅝⅞]/gi, '')
    .replace(/\bteaspoon\b/gi, ' ')
  cleaned = cleaned
    .replace(/\bof\b\s*/g, '')
    .replace(/\d+/g, '')
    .trim()
  cleaned = cleaned.replace(/(\w+),.*/, '$1');

  // Remove any remaining numbers and extra spaces
  cleaned = cleaned.replace(/\d+/g, '').trim()

  // Take only the last word as the main ingredient name
  //let words = cleaned.split(" ");
  //return words[words.length - 1];
  return cleaned
}

const allFoods = JSON.parse(fs.readFileSync('public/gh_ings.json', 'utf8'))[
  'foods'
]
//const allFoods = JSON.parse(fs.readFileSync('./ingredient_list.json', 'utf8'))['foods'];
// console.log(allFoods)

function countMatchingWords(text, reference) {
  // Convert both strings to lowercase and split into words
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

function sanitizeIngredient(inge) {
  const ing = simplifyIngredient(inge)
  //console.log(ing)

  const tallies = allFoods
    .map((food) => ({ food, matches: countMatchingWords(ing, food) }))
    .sort((a, b) => b.matches - a.matches)
  const val = tallies[0].matches
  if (val === 0) {
    //console.log(ing + ' not found!')
    return null
  }
  const maxes = [tallies[0]]
  //console.log(`maxes: ${JSON.stringify(maxes)}`)
  for (let i = 1; i < tallies.length; i++) {
    if (tallies[i].matches === val) {
      maxes.push(tallies[i])
    }
  }
  //console.log(`Maxes: ${maxes.map(JSON.stringify)}`)
  for (let match of maxes) {
    //console.log(ing, match.food.toLowerCase())
    if (ing === match.food.toLowerCase()) {
      // If exact match
      //console.log(`Exact match with ${match.food}`)
      return match.food.toLowerCase()
    }
  }

  const fuse = new Fuse(
    maxes.map((m) => m.food),
    {
      includeScore: true,
    },
  )
  const result = fuse.search(ing)
  if (!result.length) {
    console.log(ing + ' has no results')
    return inge
  }
  //console.log(`Found ${result[0].item} through fuzzy search`)
  // console.log(result)
  return result[0].item
}

export default function sanitizeIngredients(ings) {
  return ings.map(sanitizeIngredient);
}
