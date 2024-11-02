import json
from recipe_scrapers import scrape_html
import requests

print('Loading function')


def lambda_handler(event, context):
    print(event)
    content = json.loads(event['body'])
    if not "url" in content:
        return {
            "statusCode": 400,
            "body": {
                "message": "URL not supplied",
                "content": content
            }
        }
    url = content['url']
    html = requests.get(url).content
    scraper = scrape_html(html, org_url=url)
    return {
        "statusCode": 200,
        "body": {
            "ingredients": scraper.ingredients()
        }
    }

