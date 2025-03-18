import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set a custom User-Agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Add additional headers if needed
    await page.setExtraHTTPHeaders({
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
    });

    // Go to the API URL
    try {
        await page.goto('https://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId=1273697&countryCode=HK', {
            waitUntil: 'networkidle0' // Ensures all requests are finished
        });
        
        // Extract the raw JSON data
        const jsonData = await page.evaluate(() => {
            return document.body.innerText;
        });
        
        // Parse and log the JSON
        try {
            const parsedData = JSON.parse(jsonData);
            console.log(parsedData);
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    } catch (error) {
        console.error('Error accessing the URL:', error);
    } finally {
        await browser.close();
    }
})();