import { GetAttractions } from "@/app/api/apis";

export default async function HeroSearch() {
  const attractions = await GetAttractions();

  return <h1>Title</h1>;
}
