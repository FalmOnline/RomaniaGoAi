import "server-only";

export async function getAttractions() {
  const baseUrl = process.env.CUSTOM_API_URL; // e.g. http://localhost:5000
  if (!baseUrl) throw new Error("Missing CUSTOM_API_URL");

  const res = await fetch(`${baseUrl}/api/attractions`, {
    // choose caching strategy
    next: { revalidate: 60 }, // refresh at most once per minute
    // cache: "no-store",      // use this if it must always be fresh
  });

  if (!res.ok) {
    throw new Error(`Custom API failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data; // <- plain JS data
}
