import sys
import cloudscraper
import certifi

url = "https://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId=1273697&countryCode=HK"

try:
    scraper = cloudscraper.create_scraper()
    res = scraper.get(url, verify=certifi.where())
    res.raise_for_status()  # Raise an error for bad status codes

    # Print request headers (headers sent to GOAT)
    print("Request Headers:", res.request.headers)

    # Print response headers (headers received from GOAT)
    print("Response Headers:", res.headers)

    sys.exit(0)
except Exception as e:
    # Print raw error message
    print(f"Error: {e}")
    sys.exit(1)