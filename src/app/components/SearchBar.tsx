// src/components/SearchBar.tsx
export default function SearchBar({ query, setQuery }: { query: string; setQuery: (q: string) => void }) {
  return (
    <input
      type="text"
      className="w-full border border-gray-300 rounded-full px-4 py-2 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      placeholder="Search… castles, events, hiking"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
