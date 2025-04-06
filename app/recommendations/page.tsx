'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRecommendations } from '@/app/context/RecommendationsContext';

export default function RecommendationsPage() {
  const { recommendations } = useRecommendations();
  const [customPlant, setCustomPlant] = useState('');

  const handleCustomPlant = (event: React.FormEvent) => {
    event.preventDefault();
    if (customPlant.trim()) {
      console.log('User wants:', customPlant);
      alert(`You requested info about: ${customPlant}`);
      setCustomPlant('');
    }
  };

  // If there's no data in context, the user might have come directly here,
  // or hasn't filled out the questionnaire. You can handle that:
  if (!recommendations.length) {
    return (
      <main className="max-w-5xl mx-auto p-4">
        <h1>No recommendations found. Please fill out the questionnaire first!</h1>
      </main>
    );
  }

  const limitedRecommendations = recommendations.slice(0, 6);

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        Here are Your Recommended Plants
      </h1>
      <p className="text-center text-gray-700 mb-8">
        Based on your location and sunlight hours
      </p>

      {/* Display the recommendations from context */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {limitedRecommendations.map((plant: any, i: number) => (
          <Link
            key={i}
            href={`/plant/${plant.id || i}`}
            className="bg-white rounded-lg shadow p-4 flex flex-col"
          >
            
              <img
                src={plant.imageUrl}
                alt={plant.name || plant.plantName}
                className="w-full h-36 object-cover rounded mb-3"
              />
            
            <h2 className="text-base sm:text-lg font-semibold">
              {plant.name || plant.plantName}
            </h2>
            {plant.successRate && (
              <p className="text-sm text-gray-600 mt-auto">
                Success Rate: {plant.successRate}
              </p>
            )}
          </Link>
        ))}
      </div>

      {/* Custom plant text field + GO button */}
      <div className="mt-10 p-4 bg-gray-50 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Don’t like these recommendations?
        </h2>
        <p className="text-gray-700 mb-4">
          Type any plant you want and we’ll fetch its details:
        </p>
        <form onSubmit={handleCustomPlant} className="flex items-center space-x-2">
          <input
            type="text"
            value={customPlant}
            onChange={(e) => setCustomPlant(e.target.value)}
            placeholder="e.g. Tomatoes"
            className="border border-gray-300 px-3 py-2 rounded w-full sm:w-auto"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            GO
          </button>
        </form>
      </div>
    </main>
  );
}
