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
      <main className="max-w-xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-2">Plant not found</h1>
        <p className="mb-4">No plant data found for ID: {id}.</p>
        <button
          className="bg-gray-200 px-4 py-2 rounded"
          onClick={() => router.push("/recommendations")}
        >
          Go Back
        </button>
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
      router.push("/dashboard");
    } catch (error) {
      console.error("Error activating plant:", error);
      alert("Failed to activate plant");
    }
  }

  return (
    <main className="max-w-xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        {/* Plant Image */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={displayName}
            className="w-full h-64 object-cover rounded mb-4"
          />
        )}

        {/* Plant Name */}
        <h1 className="text-2xl font-bold mb-2">{displayName}</h1>

        {/* Success Rate */}
        {successRate && (
          <p className="text-gray-700 mb-4">Success Rate: {successRate}</p>
        )}

        {/* Steps (if your data has an array of steps) */}
        {Array.isArray(steps) && steps.length > 0 && (
          <div className="text-left w-full">
            <h2 className="text-lg font-semibold mb-2">
              Steps you'll need to follow:
            </h2>
            <ol className="list-decimal list-inside space-y-1">
              {steps.map((step, idx) => (
                <li key={idx}>
                  {/* If step is an object with { title, description }, adapt accordingly */}
                  {typeof step === "string" ? step : step.title}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Proceed to Plant Button (centered) */}
        <button
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          onClick={handleProceedToPlant}
        >
          Proceed to Plant
        </button>
      </div>
      <ChatToggle />
    </main>
  );
}
