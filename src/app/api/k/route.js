export async function GET() {
  const productId = '1273697';
  const goatUrl = `https://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId=${productId}&countryCode=HK`;
  
  try {
    // Create a request with minimal headers, excluding User-Agent
    const response = await fetch(goatUrl, {
      headers: {
        'Accept': 'application/json',
        'Referer': 'https://www.goat.com/sneakers/product-template/' + productId,
        'Origin': 'https://www.goat.com',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin'
      },
      redirect: 'follow',
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching from GOAT API:', error);
    return Response.json(
      { error: 'Failed to fetch product data', details: error.message },
      { status: 500 }
    );
  }
}