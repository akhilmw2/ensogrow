'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function RecommendationsPage() {
  // Mock recommended plants
  const recommendedPlants = [
    {
      id: 1,
      name: 'Cherry Tomato',
      imageUrl:
        'https://images.unsplash.com/photo-1592928302844-819c9a7df08c?auto=format&fit=crop&w=500&q=80',
      successRate: 85
    },
    {
      id: 2,
      name: 'Basil',
      imageUrl:
        'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80',
      successRate: 90
    },
    {
      id: 3,
      name: 'Lettuce',
      imageUrl:
        'https://images.unsplash.com/photo-1495114490396-c3d5df2c6b98?auto=format&fit=crop&w=500&q=80',
      successRate: 75
    },
    {
      id: 4,
      name: 'Mint',
      imageUrl:
        'https://images.unsplash.com/photo-1621162615973-3e1bfa3f9bb1?auto=format&fit=crop&w=500&q=80',
      successRate: 80
    },
    {
      id: 5,
      name: 'Spinach',
      imageUrl:
        'https://images.unsplash.com/photo-1551892589-865f69869443?auto=format&fit=crop&w=500&q=80',
      successRate: 70
    },
    {
      id: 6,
      name: 'Bell Pepper',
      imageUrl:
        'https://images.unsplash.com/photo-1530746775211-cd60f5f2fcfc?auto=format&fit=crop&w=500&q=80',
      successRate: 65
    }
  ];

  // State for the custom plant the user wants
  const [customPlant, setCustomPlant] = useState('');

  // Handle "Go" button
  const handleCustomPlant = (event: React.FormEvent) => {
    event.preventDefault();
    if (customPlant.trim()) {
      // e.g., call backend or navigate to a new page with customPlant
      console.log('User wants:', customPlant);
      alert(`You requested info about: ${customPlant}`);
      // Reset the field if desired
      setCustomPlant('');
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        Here are Your Recommended Plants
      </h1>
      <p className="text-center text-gray-700 mb-8">
        Based on your location and sunlight hours
      </p>

      {/* Grid of 6 cards, 2 columns by default, 3 columns at md */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {recommendedPlants.map((plant) => (
          <Link
            key={plant.id}
            href={`/plant/${plant.id}`}  // <-- dynamic route, e.g. /plant/1
            className="bg-white rounded-lg shadow p-4 flex flex-col"
          >
            <img
              src={plant.imageUrl}
              alt={plant.name}
              className="w-full h-36 object-cover rounded mb-3"
            />
            <h2 className="text-base sm:text-lg font-semibold">
              {plant.name}
            </h2>
            <p className="text-sm text-gray-600 mt-auto">
              Success Rate: {plant.successRate}%
            </p>
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
