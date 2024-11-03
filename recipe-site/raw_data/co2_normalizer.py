import json
import math

# Read the original JSON file
with open('recipe-site/raw_data/co2_data.json', 'r') as file:
    data = json.load(file)

# Apply normalization function to each value
normalized_data = {
    key: math.exp(-(value/9)) 
    for key, value in data.items()
}

# Save the normalized data to a new file
with open('recipe-site/raw_data/co2_data_normalized.json', 'w') as file:
    json.dump(normalized_data, file, indent=2)