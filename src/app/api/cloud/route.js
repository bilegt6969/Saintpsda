import CF from "cfbypass"; // Use ES module import

export async function GET() { // Replace `req` with `_` since it's unused
  try {
    const cf = new CF(true); // Set to true if using Python 3

    const data = await cf.request({
      url: "https://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId=603936&countryCode=HK",
      options: {
        method: "GET",
      },
    });

    return Response.json(await data.json()); // Ensure the response is properly formatted
  } catch (err) {
    console.error("Error fetching data:", err);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
