// src/components/SearchResults.tsx
export default function SearchResults({ results }: { results: { attractions: string[]; events: string[] } }) {
  return (
    <div className="space-y-6">
      {results.attractions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Attractions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {results.attractions.map((name, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow">
                <div className="h-32 bg-gray-200 mb-2 rounded" />
                <h3>{name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.events.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {results.events.map((name, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow">
                <div className="h-32 bg-gray-200 mb-2 rounded" />
                <h3>{name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
