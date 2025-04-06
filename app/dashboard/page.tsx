import ChatToggle from "@/components/chatbot/ChatToggle";
import Link from "next/link";
import React from "react";
import { redirect } from "next/navigation";

interface Plant {
  id: string;
  name: string;
  imageUrl: string;
  totalSteps: number; // total steps required
  completedSteps: number; // how many steps user has done
}

const DashboardPage = async () => {
  // Mock data: in a real app, fetch from an API or global store
  console.log("key : ", process.env.NEXT_PUBLIC_GEMINI_API_KEY);

  const myPlants: Plant[] = [
    {
      id: "1",
      name: "Cherry Tomato",
      imageUrl:
        "https://images.unsplash.com/photo-1592928302844-819c9a7df08c?auto=format&fit=crop&w=500&q=80",
      totalSteps: 6,
      completedSteps: 2,
    },
    {
      id: "2",
      name: "Basil",
      imageUrl:
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80",
      totalSteps: 4,
      completedSteps: 1,
    },
    {
      id: "3",
      name: "Mint",
      imageUrl:
        "https://images.unsplash.com/photo-1621162615973-3e1bfa3f9bb1?auto=format&fit=crop&w=500&q=80",
      totalSteps: 5,
      completedSteps: 5,
    },
  ];

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Your Dashboard
      </h1>
      {myPlants.length === 0 ? (
        <p className="text-center text-gray-700">No plants yet!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {myPlants.map((plant) => {
            const progressPercent =
              (plant.completedSteps / plant.totalSteps) * 100;

            return (
              <Link
                key={plant.id}
                href={`/plant-tracking/${plant.id}`}
                className="bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-md transition-shadow"
              >
                <img
                  src={plant.imageUrl}
                  alt={plant.name}
                  className="w-full h-36 object-cover rounded mb-4"
                />
                <h2 className="text-lg font-semibold mb-2">{plant.name}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  Steps Completed: {plant.completedSteps}/{plant.totalSteps}
                </p>

                {/* Simple progress bar (optional) */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <p className="text-sm text-gray-400 mt-auto">
                  Tap to view steps
                </p>
              </Link>
            );
          })}
        </div>
      )}
      <ChatToggle />
    </main>
  );
};

export default DashboardPage;
