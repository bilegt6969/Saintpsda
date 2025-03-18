import puppeteer from 'puppeteer';

export async function GET() {
    let browser;
    try {
        // Launch Puppeteer browser
        browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set a custom User-Agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        // Add additional headers if needed
        await page.setExtraHTTPHeaders({
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
        });

        // Go to the API URL
        await page.goto('https://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId=1273697&countryCode=HK', {
            waitUntil: 'networkidle0' // Ensures all requests are finished
        });

        // Extract the raw JSON data
        const jsonData = await page.evaluate(() => {
            return document.body.innerText;
        });

        // Parse the JSON data
        const parsedData = JSON.parse(jsonData);

        // Close the browser
        await browser.close();

        // Return the scraped data as a JSON response
        return new Response(JSON.stringify(parsedData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        // Handle errors
        if (browser) {
            await browser.close();
        }
        console.error('Error:', error);

        return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}