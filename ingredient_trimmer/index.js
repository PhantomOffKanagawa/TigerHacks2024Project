import fs from 'fs'
import Fuse from 'fuse.js'

const scrapedData = JSON.parse(fs.readFileSync('./response.json', 'utf8'));
//const scrapedData = JSON.parse(fs.readFileSync('./chicken_response.json', 'utf8'));
//const scrapedData = JSON.parse(fs.readFileSync('./pasta_response.json', 'utf8'));

const { ingredients } = scrapedData

console.log(ingredients)

function simplifyIngredient(ingredient) {
    //let cleaned = ingredient.replace(/\(.*?\)/g, '');
    // Remove content inside parentheses or any text following an unmatched opening parenthesis
    let cleaned = ingredient.replace(/\(.*?\)|\(.*$/g, '');

    // Remove measurements and quantities (e.g., "1 1/2 cups", "6.75 ounces", etc.)
    cleaned = cleaned.replace(/\b\d+([\/.\d]*)?\s*(cups?|tbsp|tsp|tablespoon(s)?|teaspoon(s)?|ounce(s)?|gram(s)?|milliliters?|liter(s)?|pinch(es)?|dash(es)?|jar(s)?|pound(s)?|lb(s)?|kg(s)?|gram(s)?|g|ml|oz)\b/gi, '');
    cleaned = cleaned.replace(/\b(fresh|sliced)\b/gi, '').replace(/\s{2,}/g, ' ')
    cleaned = cleaned.replace(/[\d¼½¾⅓⅔⅛⅜⅝⅞]/gi, '').replace(/\bteaspoon\b/gi, ' ')
    cleaned = cleaned.replace(/\bof\b\s*/g, '').replace(/\d+/g, '').trim();

    // Remove any remaining numbers and extra spaces
    cleaned = cleaned.replace(/\d+/g, '').trim();

    // Take only the last word as the main ingredient name
    //let words = cleaned.split(" ");
    //return words[words.length - 1];
    return cleaned
}

const trimmed = ingredients.map(simplifyIngredient)
console.log(trimmed)


const allFoods = JSON.parse(fs.readFileSync('./gh_ings.json', 'utf8'))['foods'];
//const allFoods = JSON.parse(fs.readFileSync('./ingredient_list.json', 'utf8'))['foods'];
// console.log(allFoods)

const fuse = new Fuse(allFoods, {
  includeScore: true
})

// const result = fuse.search('packed light brown sugar')
for (let ing of trimmed) {
  const result = fuse.search(ing)
  if (!result.length) {
    console.log(ing + " has no results")
    continue;
  }
  console.log(result[0])
}
// console.log(result)

export {}


