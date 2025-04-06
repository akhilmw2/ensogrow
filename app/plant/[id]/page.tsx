// app/plant/[id]/page.tsx

'use client';

// import { Metadata } from 'next';

// // Optional: set metadata
// export const metadata: Metadata = {
//   title: 'Plant Details',
// };

export default function PlantDetailsPage({ params }: { params: { id: string } }) {
  // params.id = the plant ID from the URL (e.g., "1", "tomato", etc.)

  // In a real app, you'd fetch data from your backend using params.id.
  // For this demo, let's mock data:
  const mockPlantData = {
    name: 'Cherry Tomato',
    imageUrl:
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80',
    successRate: 85,
    steps: [
      'Choose a container with drainage holes',
      'Use a high-quality potting mix',
      'Plant seeds or seedlings about 2-3 inches deep',
      'Water thoroughly, keep soil moist but not soggy',
      'Place in a spot with 6+ hours of sunlight daily',
      'Fertilize lightly every couple of weeks'
    ]
  };

  // If you had multiple plants, you might conditionally return the correct data
  // based on params.id. For now, we're just returning the mock data above.

  return (
    <main className="max-w-xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        {/* Plant Image */}
        <img
          src={mockPlantData.imageUrl}
          alt={mockPlantData.name}
          className="w-full h-64 object-cover rounded mb-4"
        />
        
        {/* Plant Name */}
        <h1 className="text-2xl font-bold mb-2">{mockPlantData.name}</h1>
        
        {/* Success Rate */}
        <p className="text-gray-700 mb-4">
          Success Rate: {mockPlantData.successRate}%
        </p>

        {/* Steps */}
        <div className="text-left w-full">
          <h2 className="text-lg font-semibold mb-2">Steps you'll need to follow:</h2>
          <ol className="list-decimal list-inside space-y-1">
            {mockPlantData.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>

        {/* Proceed to Plant Button (centered) */}
        <button
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          onClick={() => alert('Planting process started!')}
        >
          Proceed to Plant
        </button>
      </div>
    </main>
  );
}
