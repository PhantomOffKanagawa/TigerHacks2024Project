import fs from 'fs'

const data = JSON.parse(fs.readFileSync('./response.json', 'utf8'));

const { ingredients } = data

console.log(ingredients)

function simplifyIngredient(ingredient) {
    // Remove any content inside parentheses
    let cleaned = ingredient.replace(/\(.*?\)/g, '');

    // Remove measurements and quantities (e.g., "1 1/2 cups", "6.75 ounces", etc.)
    cleaned = cleaned.replace(/\b\d+([\/.\d]*)?\s*(cups?|tablespoons?|teaspoons?|ounces?|grams?|milliliters?|liters?|pinches?|dash(es)?|pounds?|lbs?|kgs?|grams?|g|ml|oz)\b/gi, '');
    cleaned = cleaned.replace(/\bof\b/g, '').replace(/\d+/g, '').trim();

    // Remove any remaining numbers and extra spaces
    cleaned = cleaned.replace(/\d+/g, '').trim();

    // Take only the last word as the main ingredient name
    //let words = cleaned.split(" ");
    //return words[words.length - 1];
    return cleaned
}

console.log(ingredients.map(simplifyIngredient))

export {}


