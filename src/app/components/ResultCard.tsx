import React from 'react';

export default function ResultCard({ title, type }: { title: string; type: 'attraction' | 'event' }) {
  return (
    <div className="min-w-[200px] bg-white shadow-md rounded-xl p-4">
      <div className="text-sm text-gray-500 uppercase">{type}</div>
      <h3 className="text-lg font-medium">{title}</h3>
    </div>
  );
}
