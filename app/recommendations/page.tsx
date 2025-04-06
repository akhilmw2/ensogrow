"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRecommendations } from "@/app/context/RecommendationsContext";
import { postCustomPlants } from "@/lib/api";
import ChatToggle from "@/components/chatbot/ChatToggle";

export default function RecommendationsPage() {
  const router = useRouter();
  const {
    recommendations,
    setRecommendations,
    location,
    width,
    height,
    sunlightHours,
  } = useRecommendations();
  const [customPlant, setCustomPlant] = useState("");

  const handleCustomPlant = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!customPlant.trim()) return;
    try {
      const formData = {
        location,
        sunlightHours,
        availableSpace: `${width}x${height} ft`,
        plantName: customPlant,
      };
      // 1. Call the backend to create/fetch the custom plant
      const data = await postCustomPlants(formData);
      // Suppose data = { id: 99, plantName: "Tomatoes", ... }
      console.log({ data });
      setRecommendations((prev) => [...prev, data]);
      // 2. Redirect to /plant/[id] if success
      router.push(`/plant/${data._id}`);
    } catch (err: any) {
      // If it's an Axios error, check err.response?.status
      if (err.response?.status === 400) {
        alert("Try something else");
      } else {
        // For other errors, handle or log
        console.error("Error creating custom plant:", err);
      }
    } finally {
      setCustomPlant("");
    }
  };

  // If there's no data in context, the user might have come directly here,
  // or hasn't filled out the questionnaire. You can handle that:
  if (!recommendations.length) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center relative px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-6">
          Oops! No recommendations found.
        </h1>
        <p className="text-lg sm:text-xl text-center text-gray-600 mb-8">
          Looks like you haven’t filled out the questionnaire yet.
        </p>

        <div className="text-center">
          <Link
            href="/landing"
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-lg shadow-lg transition-all transform hover:scale-105 duration-300 ease-in-out"
          >
            Fill Out Questionnaire
          </Link>
        </div>
        <ChatToggle />
      </main>
    );
  }

  const limitedRecommendations = recommendations.slice(0, 6);

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-green-50 to-green-100 relative">
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-900">
        Here are Your Recommended Plants
      </h1>
      <p className="text-lg sm:text-xl text-center text-gray-700 mb-8">
        Based on your location and sunlight hours
      </p>
      {/* Display the recommendations from context */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {limitedRecommendations.map((plant: any, i: number) => (
          <Link
            key={i}
            href={`/plant/${plant._id || i}`}
            className="bg-white rounded-lg shadow-lg p-6 flex flex-col transition-transform transform hover:scale-105 duration-300 ease-in-out"
          >
            <img
              src="https://picsum.photos/500/500"
              alt={plant.name || plant.plantName}
              className="w-full h-40 sm:h-48 object-cover rounded mb-4"
            />

            <h2 className="text-xl font-semibold text-gray-800">
              {plant.name || plant.plantName}
            </h2>
            {plant.successRate && (
              <p className="text-sm text-gray-600 mt-auto">
                Plantation Success: {plant.successRate}
              </p>
            )}
          </Link>
        ))}
      </div>
      {/* Custom plant text field + GO button */}
      <div className="mt-12 p-6 bg-green-50 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-6">
          Don’t like these recommendations?
        </h2>
        <p className="text-center text-gray-700 mb-6">
          Tell us what you want to grow:
        </p>
        <form
          onSubmit={handleCustomPlant}
          className="flex items-center space-x-4 justify-center"
        >
          <input
            type="text"
            value={customPlant}
            onChange={(e) => setCustomPlant(e.target.value)}
            placeholder="e.g. Tomatoes"
            className="w-full sm:w-64 border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3 rounded-lg"
          >
            GO
          </button>
        </form>
      </div>
      <ChatToggle />
    </main>
  );
}
