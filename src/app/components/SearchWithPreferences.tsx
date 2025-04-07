"use client";

import { useState, useEffect } from "react";

const mockAttractions = [
  { id: 1, name: "Castle Bran", type: "Attraction" },
  { id: 2, name: "Peleș Castle", type: "Attraction" },
  { id: 3, name: "Medieval Festival", type: "Event" },
  { id: 4, name: "Jazz at the Castle", type: "Event" },
];

export default function SearchWithPreferences() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate auth

  useEffect(() => {
    if (query.length >= 3) {
      const filtered = mockAttractions.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSavePreference = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
    } else if (!preferences.includes(query)) {
      setPreferences([...preferences, query]);
      setQuery("");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search attractions, events..."
        className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow"
      />

      {results.length > 0 && (
        <div className="mt-2 border rounded-lg p-4 bg-white shadow">
          <h4 className="font-semibold mb-2">Results</h4>
          {results.map((item) => (
            <div
              key={item.id}
              className="py-1 border-b last:border-none text-sm text-gray-800"
            >
              {item.name} - {item.type}
            </div>
          ))}
          <button
            onClick={handleSavePreference}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save "{query}" as a preference
          </button>
        </div>
      )}

      {showLoginPrompt && (
        <div className="mt-4 bg-yellow-100 p-4 rounded border border-yellow-300">
          <p className="text-sm">
            You need to log in to save preferences.
          </p>
          <div className="mt-2">
            <button className="bg-blue-600 text-white px-3 py-1 rounded mr-2">
              Login
            </button>
            <button
              className="text-sm text-gray-600 underline"
              onClick={() => setShowLoginPrompt(false)}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {preferences.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Recommended for you</h4>
          <div className="flex gap-4 overflow-x-auto">
            {mockAttractions
              .filter((item) =>
                preferences.some((pref) =>
                  item.name.toLowerCase().includes(pref.toLowerCase())
                )
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="min-w-[200px] bg-white rounded shadow p-3 border"
                >
                  <h5 className="font-medium text-sm mb-1">{item.name}</h5>
                  <p className="text-xs text-gray-500">{item.type}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
