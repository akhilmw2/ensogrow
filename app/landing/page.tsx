"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRecommendations } from "@/app/context/RecommendationsContext";
import { postCropRecommendation } from "@/lib/api";
import ChatToggle from "@/components/chatbot/ChatToggle";

export default function QuestionnairePage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Track loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

  const router = useRouter();
  const {
    setRecommendations,
    location,
    setLocation,
    width,
    setWidth,
    height,
    setHeight,
    sunlightHours,
    setSunlightHours,
  } = useRecommendations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Start loading
    setIsModalOpen(true); // Show the modal

    const formData = {
      location,
      sunlightHours,
      availableSpace: `${width}x${height} ft`,
    };

    try {
      const response = await postCropRecommendation(formData);
      if (response?.data) {
        setRecommendations(response.data);
      }
      router.push("/recommendations");
    } catch (err) {
      setError("Error fetching recommendations. Please try again.");
    } finally {
      setLoading(false); // End loading
      setIsModalOpen(false); // Close the modal after the response
    }
  };

  return (
    <main className="bg-gradient-to-r from-green-50 via-green-100 to-green-200 min-h-screen py-10 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Soft, transparent leaf elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-[url('/leaf-pattern.png')] bg-cover bg-center opacity-15 z-0"></div>
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-3xl p-8 z-10 relative">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 leading-tight">
          🌿 Balcony Garden Setup
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              className="block text-lg font-medium text-gray-700 mb-3"
              htmlFor="location"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="e.g. Chicago, IL"
              className="w-full border border-gray-300 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 shadow-lg"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              className="block text-lg font-medium text-gray-700 mb-3"
              htmlFor="space"
            >
              Space (Width × Height in ft)
            </label>
            <div className="flex space-x-6">
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="Width"
                className="w-1/2 border border-gray-300 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 shadow-lg"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                required
              />
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="Height"
                className="w-1/2 border border-gray-300 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 shadow-lg"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label
              className="block text-lg font-medium text-gray-700 mb-3"
              htmlFor="sunlightHours"
            >
              Hours of Direct Sunlight
            </label>
            <input
              id="sunlightHours"
              type="text"
              inputMode="numeric"
              pattern="\d*"
              placeholder="e.g. 6"
              className="w-full border border-gray-300 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 shadow-lg"
              value={
                sunlightHours === 0 && sunlightHours !== "" ? "" : sunlightHours
              }
              onChange={(e) => {
                const rawValue = e.target.value;
                const numericOnly = rawValue.replace(/[^0-9]/g, "");

                if (numericOnly === "") {
                  setSunlightHours("" as unknown as number); // Hack to allow clearing
                } else {
                  const number = parseInt(numericOnly);
                  setSunlightHours(number);
                }
              }}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 shadow-lg ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin h-5 w-5 border-4 border-t-transparent border-green-400 rounded-full"></div>
              </div>
            ) : (
              "Get Recommendations"
            )}
          </button>
        </form>

        {error && (
          <p className="mt-6 text-center text-red-500 font-medium">{error}</p>
        )}
      </div>

      {/* Modal for loading state */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full h-60 flex flex-col justify-center items-center">
            <div className="animate-spin h-10 w-10 border-4 border-t-transparent border-green-400 rounded-full mb-4"></div>
            <p className="text-lg text-gray-800 font-medium">
              Fetching the best recommendation for you...
            </p>
          </div>
        </div>
      )}

      <ChatToggle />
    </main>
  );
}
