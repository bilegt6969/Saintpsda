// app/api/proxy/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const productTemplateId = searchParams.get("productTemplateId");
    const countryCode = searchParams.get("countryCode");

    // Validate required parameters
    if (!productTemplateId || !countryCode) {
        return NextResponse.json(
            { error: "Missing productTemplateId or countryCode" },
            { status: 400 }
        );
    }

    // Construct the Goat.com API URL
    const apiUrl = `https://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId=${productTemplateId}&countryCode=${countryCode}`;

    try {
        // Fetch data from the Goat.com API with browser-like headers
        const response = await fetch(apiUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36", // Mimic a real browser
                "Referer": "https://www.goat.com/", // Set the referer to Goat.com
                "Origin": "https://www.goat.com", // Set the origin to Goat.com
                "Accept": "application/json", // Accept JSON responses
                "Accept-Language": "en-US,en;q=0.9", // Set accepted languages
            },
        });

        // Check if the API request was successful
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Return the data as a JSON response
        return NextResponse.json(data);
    } catch (error) {
        // Handle errors
        return NextResponse.json(
            { error: error.message || "Failed to fetch data" },
            { status: 500 }
        );
    }
}