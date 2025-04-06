// app/dashboard/page.tsx
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

export default async function DashboardPage() {
  // 1) Fetch active plants
  const res = await fetch(`${API_BASE_URL}/plants/active`, {
    cache: 'no-store', // ensures fresh data on each request
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch active plants. Status: ${res.status}`);
  }

  const data = await res.json();
  const activePlants = data.data || [];

  // 2) If no plants, show fallback
  if (!activePlants.length) {
    return (
      <main className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Your Dashboard
        </h1>
        <p className="text-center">No plants yet!</p>
      </main>
    );
  }

  // 3) Render the plants
  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Your Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {activePlants.map((plant: any) => {
          // The response has "steps", each with isCompleted
          const steps = plant.steps || [];
          const totalSteps = steps.length;
          const completedSteps = steps.filter((s: any) => s.isCompleted).length;
          const progressPercent = totalSteps
            ? (completedSteps / totalSteps) * 100
            : 0;

          return (
            <Link
              key={plant._id}
              href={`/plant-tracking/${plant._id}`}
              className="bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-md transition-shadow"
            >
              {/* Optional image if it exists */}
              {plant.imageUrl && (
                <img
                  src={plant.imageUrl}
                  alt={plant.plantName}
                  className="w-full h-36 object-cover rounded mb-4"
                />
              )}
              <h2 className="text-lg font-semibold mb-2">{plant.plantName}</h2>
              <p className="text-sm text-gray-600 mb-2">
                Steps Completed: {completedSteps}/{totalSteps}
              </p>

              {/* Simple progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="text-sm text-gray-400 mt-auto">Tap to view steps</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
