"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getActivePlants } from "@/lib/api"; // <-- the Axios-based function
import { deleteCookie } from "@/lib/cookies";
import { redirect } from "next/navigation";
import ChatToggle from "@/components/chatbot/ChatToggle";

export default function DashboardPage() {
  const [activePlants, setActivePlants] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchActive() {
      try {
        const data = await getActivePlants(); // uses axios + token
        setActivePlants(data.data || []);
      } catch (err) {
        console.error("Failed to fetch active plants:", err);
      }
    }
    fetchActive();
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    console.log("User logged out");
    deleteCookie("accessToken");
    redirect("/login");
  };

  // If no plants
  if (!activePlants.length) {
    return (
      <main className="bg-gradient-to-r from-green-50 via-green-100 to-green-200 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            Your Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            No plants yet! Start adding some plants to track their progress.
          </p>
        </div>
        <ChatToggle />
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-r from-green-50 via-green-100 to-green-200 min-h-screen py-10 px-6 flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header and Logout Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">
            Your Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="text-lg font-medium text-red-500 hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Active Plants Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {activePlants.map((plant: any) => {
            const steps = plant.steps || [];
            const totalSteps = steps.length;
            const completedSteps = steps.filter(
              (s: any) => s.isCompleted
            ).length;
            const progressPercent = totalSteps
              ? (completedSteps / totalSteps) * 100
              : 0;

            return (
              <Link
                key={plant._id}
                href={`/plant-tracking/${plant._id}`}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="p-6 flex flex-col justify-between h-full">
                  {plant.imageUrl && (
                    <img
                      src={plant.imageUrl}
                      alt={plant.plantName}
                      className="w-full h-48 object-cover rounded-xl mb-4 shadow-md"
                    />
                  )}
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {plant.plantName}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Steps Completed: {completedSteps}/{totalSteps}
                  </p>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <p className="text-sm text-gray-400 mt-auto">
                    Tap to view steps
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <ChatToggle />
    </main>
  );
}
