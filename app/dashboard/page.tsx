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
      <main className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Your Dashboard
        </h1>
        <p className="text-center">No plants yet!</p>
        <ChatToggle />
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
      {/* header and logout button */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {activePlants.map((plant: any) => {
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
      <ChatToggle />
    </main>
  );
}
