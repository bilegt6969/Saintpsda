import puppeteer from 'puppeteer';

export async function GET() {
    let browser;
    try {
        console.log('Launching Puppeteer browser...');
        browser = await puppeteer.launch();
        console.log('Browser opened successfully!');

        const page = await browser.newPage();
        console.log('New page created.');

        // Set a custom User-Agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        console.log('User-Agent set.');

        // Add additional headers if needed
        await page.setExtraHTTPHeaders({
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
        });
        console.log('Extra HTTP headers set.');

        // Go to the API URL
        console.log('Navigating to the target URL...');
        await page.goto('https://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId=1273697&countryCode=HK', {
            waitUntil: 'networkidle0' // Ensures all requests are finished
        });
        console.log('Page loaded successfully!');

        // Extract the raw JSON data
        console.log('Extracting JSON data from the page...');
        const jsonData = await page.evaluate(() => {
            return document.body.innerText;
        });
        console.log('JSON data extracted:', jsonData);

        // Parse the JSON data
        console.log('Parsing JSON data...');
        const parsedData = JSON.parse(jsonData);
        console.log('JSON data parsed successfully!');

        // Close the browser
        console.log('Closing the browser...');
        await browser.close();
        console.log('Browser closed.');

        // Return the scraped data as a JSON response
        console.log('Returning JSON response...');
        return new Response(JSON.stringify(parsedData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        // Handle errors
        console.error('Error occurred:', error);

        if (browser) {
            console.log('Closing the browser due to error...');
            await browser.close();
            console.log('Browser closed.');
        }

        return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}