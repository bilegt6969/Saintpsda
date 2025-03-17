export async function GET() {
    // Extract query parameters from client
    // const { searchParams } = new URL(request.url);
    // const productId = searchParams.get('productTemplateId');
    // const country = searchParams.get('countryCode');
  
    // Build GOAT API URL
    const goatUrl = `https://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId=290638&countryCode=HK`;
  
    try {
        const response = await fetch(goatUrl);
        const data = await response.json();
        return Response.json(data);
      } catch {
        return Response.json(
          { error: 'Failed to fetch product data' },
          { status: 500 }
        );
      }
  }