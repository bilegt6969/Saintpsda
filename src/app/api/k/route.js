export async function GET() {
  const productId = '1273697';
  const goatUrl = `https://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId=${productId}&countryCode=HK`;
  
  try {
    const response = await fetch(goatUrl, {
      headers: {
        'Accept': 'application/json',
        'Origin': 'https://www.goat.com',
        'Referer': 'https://www.goat.com/sneakers/product-template/' + productId,
        // Making the request appear to come from GOAT's own website
        'Host': 'www.goat.com',
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


//curl provider.