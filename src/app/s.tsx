"use client"; // Mark this as a Client Component

import { useState, useEffect } from "react";

export default function ProductPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from the proxy route
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "/api/proxy?productTemplateId=1273697&countryCode=HK"
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }

                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Product Data</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}