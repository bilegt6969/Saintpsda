import { connect } from "puppeteer-real-browser";

export async function GET() {
  try {
    const { browser, page } = await connect({
      headless: true,
      args: [],
      customConfig: {},
      turnstile: true,
      connectOption: {},
      disableXvfb: false,
      ignoreAllFlags: false,
    });

    await page.goto(
      "https://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId=603936&countryCode=HK"
    );
    const content = await page.content();

    await browser.close();

    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}