// app/dashboard/page.tsx
"use client";
import ChatToggle from "@/components/chatbot/ChatToggle";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { deleteCookie } from "@/lib/utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

const DashboardPage = () => {
  // Mock data: in a real app, fetch from an API or global store
  const [activePlants, setActivePlants] = useState([]);
  console.log("key : ", process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  useEffect(() => {
    (async function () {
      const res = await fetch(`${API_BASE_URL}/plants/active`, {
        cache: "no-store", // ensures fresh data on each request
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch active plants. Status: ${res.status}`);
      }

      const data = await res.json();
      setActivePlants(data.data);
    })();
  }, []);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    // Handle logout logic here (e.g., clear session, redirect)
    console.log("User logged out");
    deleteCookie("accessToken");
    redirect("/login"); // Example of redirecting to a login page
  };

  // Default profile image URL
  const defaultProfileImage = "https://www.w3schools.com/w3images/avatar2.png"; // Replace this with a suitable default image URL

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
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Your Dashboard
        </h1>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 text-gray-800 hover:text-gray-600"
          >
            {/* Profile Image */}
            <img
              src={defaultProfileImage} // Use default image
              alt="User Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="hidden sm:inline-block text-sm">User</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-40 z-10">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

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
};

export default DashboardPage;
