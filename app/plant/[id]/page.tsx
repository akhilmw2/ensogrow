"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useRecommendations } from "@/app/context/RecommendationsContext";
import { activatePlant } from "@/lib/api";
import ChatToggle from "@/components/chatbot/ChatToggle";

export default function PlantDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  // Access all recommendations from context
  const { recommendations } = useRecommendations();

  // Find the plant with matching ID
  const plant = recommendations.find((p) => p._id === id);

  // If no plant is found, maybe the user navigated directly or has stale context
  if (!plant) {
    return (
      <main className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-gradient-to-r from-green-50 via-green-100 to-green-200 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center w-full max-w-md">
          <h1 className="text-xl font-bold text-gray-800 mb-4">
            Plant not found
          </h1>
          <p className="text-gray-600 mb-6">
            No plant data found for ID: {id}.
          </p>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
            onClick={() => router.push("/recommendations")}
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  // De-structure relevant fields from plant
  const { _id, plantName, name, imageUrl, successRate, steps } = plant;

  // Use whichever field for the name
  const displayName = name || plantName || "Unknown Plant";

  // Handle "Proceed to Plant"
  async function handleProceedToPlant() {
    try {
      // 1) Call API to activate this plant
      await activatePlant(_id);
      // 2) Redirect to the Dashboard
      router.push(`/plant-tracking/${_id}`);
    } catch (error) {
      console.error("Error activating plant:", error);
      alert("Failed to activate plant");
    }
  }

  return (
    <main className="bg-gradient-to-r from-green-50 via-green-100 to-green-200 min-h-screen py-10 px-6 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-[url('/leaf-pattern.png')] bg-cover bg-center opacity-20 z-0"></div>

      <div className="max-w-3xl w-full bg-white shadow-xl rounded-3xl p-8 z-10 relative flex flex-col items-center">
        {/* Plant Image */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={displayName}
            className="w-full h-64 object-cover rounded-xl shadow-md mb-6"
          />
        )}

        {/* Plant Name */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          {displayName}
        </h1>

        {/* Success Rate */}
        {successRate && (
          <p className="text-gray-600 text-lg mb-6">
            Plantation Success: {successRate}
          </p>
        )}

        {/* Steps (if your data has an array of steps) */}
        {Array.isArray(steps) && steps.length > 0 && (
          <div className="text-left w-full mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Steps you'll need to follow:
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {steps.map((step, idx) => (
                <li key={idx} className="text-lg">
                  {typeof step === "string" ? step : step.title}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Proceed to Plant Button */}
        <button
          className="mt-6 font-bold w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
          onClick={handleProceedToPlant}
        >
          Let's Plant
        </button>
      </div>

      {/* Chatbot */}
      <ChatToggle />
    </main>
  );
}
