import sys
import json
import cloudscraper
import certifi

url = "https://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId=1273697&countryCode=HK"

scraper = cloudscraper.create_scraper()
res = scraper.get(url, verify=certifi.where())

# Output data as JSON
print(json.dumps({"data": res.text}))
sys.exit(0)
