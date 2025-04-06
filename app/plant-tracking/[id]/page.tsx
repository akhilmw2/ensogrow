'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function PlantTrackingPage() {
  const params = useParams();
  const plantId = params.id; // e.g. "1" or "2"

  // Mock data. In a real app, you'd fetch from an API:
  const mockPlantData = {
    id: plantId,
    name: 'Cherry Tomato',
    imageUrl:
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80',
    steps: [
      'Choose a container with drainage holes',
      'Use high-quality potting mix',
      'Plant seeds or seedlings about 2-3 inches deep',
      'Water thoroughly, keep soil moist but not soggy',
      'Place in a spot with 6+ hours of sunlight',
      'Fertilize lightly every couple of weeks'
    ]
  };

  // We'll store which steps are completed in state:
  // A boolean array, e.g. [false, false, false, ...]
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    new Array(mockPlantData.steps.length).fill(false)
  );

  // Calculate progress
  const totalSteps = mockPlantData.steps.length;
  const doneCount = completedSteps.filter(Boolean).length;
  const progressPercent = (doneCount / totalSteps) * 100;

  // Handle checkbox toggling
  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const newCompleted = [...prev];
      newCompleted[index] = !newCompleted[index];
      return newCompleted;
    });
  };

  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        {/* Plant Header */}
        <img
          src={mockPlantData.imageUrl}
          alt={mockPlantData.name}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">{mockPlantData.name}</h1>

        {/* Progress */}
        <p className="text-gray-700 mb-2">
          Steps Completed: {doneCount}/{totalSteps}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Checkboxes */}
        <div className="text-left w-full">
          <h2 className="text-lg font-semibold mb-2">Follow these steps:</h2>
          <ul className="space-y-3">
            {mockPlantData.steps.map((step, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={completedSteps[idx]}
                  onChange={() => toggleStep(idx)}
                  className="h-4 w-4 accent-green-600"
                />
                <span
                  className={
                    completedSteps[idx] ? 'line-through text-gray-500' : ''
                  }
                >
                  {step}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
