import { getAttractions } from "@/app/api/apis";
import Card from "@/app/components/ui/Card";

export default async function AttractionsGrid() {
  const attractions = await getAttractions(); // array from your Express API

  console.log(attractions[0].locations[0].title);

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {attractions.slice(0, 9).map((a) => (
        <Card
          key={a.id}
          variant="minimal"
          title={a.title}
          slug={a.slug}
          description={a.shortDescription}
          image={
            a.image?.formats?.medium?.url ||
            a.image?.url ||
            "/default-image.jpg"
          }
          location={a.locations?.[0]?.title ?? ""}
          tags={(a.highlights ?? []).map((h) => h.title)}
        />
      ))}
    </section>
  );
}
