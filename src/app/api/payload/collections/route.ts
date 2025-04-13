import { getPayload } from 'payload';
import config from '@payload-config';

export async function GET() {
  try {
    const payload = await getPayload({ config });

    const collections = await payload.find({
      collection: 'product-collections',
      limit: 100,
    });

    return new Response(JSON.stringify(collections), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error fetching collections:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch collections" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
