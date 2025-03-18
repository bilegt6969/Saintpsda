export async function GET() {
  const productId = '1087105'; // Using the product ID from your successful request
  const goatUrl = `https://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId=${productId}&countryCode=HK`;
  
  try {
    // First, establish a session with GOAT's website
    const sessionResponse = await fetch('https://www.goat.com/', {
      redirect: 'follow',
    });
    
    // Extract cookies from the session response
    const cookies = sessionResponse.headers.get('set-cookie');
    
    // Now make the API request with those cookies
    const response = await fetch(goatUrl, {
      headers: {
        'Accept': 'application/json',
        'Origin': 'https://www.goat.com',
        'Referer': `https://www.goat.com/sneakers/product-template/${productId}`,
        'Cookie': cookies || '',
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