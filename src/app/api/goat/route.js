// app/api/goat/route.js
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
        // Fetch data from the Goat.com API
        const response = await fetch(apiUrl, {
            headers: {
                "User-Agent": "Your-App-Name", // Add required headers
                "Referer": "https://www.your-app.com", // Add required headers
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