"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPlanDetail, completeStep } from "@/lib/api";
import ChatToggle from "@/components/chatbot/ChatToggle";

export default function PlantTrackingPage() {
  const { id } = useParams(); // plantId
  const [plant, setPlant] = useState<any>(null);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Track loading state for the button
  const { push } = useRouter();

  useEffect(() => {
    async function fetchPlant() {
      try {
        const res = await getPlanDetail(id);
        const plantData = res.data;
        setPlant(plantData);

        // Set up 'completed' array based on each step's isCompleted
        const checks = plantData.steps.map((step: any) => step.isCompleted);
        setCompleted(checks);
      } catch (err) {
        console.error("Error fetching plant details:", err);
      }
    }
    fetchPlant();
  }, [id]);

  if (!plant) {
    return <p>Loading plant data...</p>;
  }

  const totalSteps = plant.steps?.length || 0;
  const doneCount = completed.filter(Boolean).length;
  const progressPercent = totalSteps ? (doneCount / totalSteps) * 100 : 0;

  async function toggleStep(index: number) {
    // Flip the local state so the UI updates immediately
    setCompleted((prev) => {
      const newArr = [...prev];
      newArr[index] = !newArr[index];
      return newArr;
    });

    // Call the backend to mark the step in DB
    try {
      const stepId = plant.steps[index]?.id;
      if (stepId !== undefined) {
        await completeStep(plant._id, stepId);
      }
    } catch (err) {
      console.error("Error completing step:", err);
      // If it fails, you might revert the UI state or show an error
    }
  }

  const handleTalkToDoctor = async () => {
    setIsLoading(true);
    try {
      // Simulate a request to the plant doctor
      // Replace this with your API request
      setTimeout(() => {
        console.log("Request sent to plant doctor!");
        setIsLoading(false);
        push(`/plant-tracking/${id}/doctor`);
      }, 3000); // Simulate a 3-second delay for loading
    } catch (error) {
      console.error("Error contacting plant doctor:", error);
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        {/* Plant Image */}
        {plant.imageUrl && (
          <img
            src={plant.imageUrl}
            alt={plant.plantName}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        <h1 className="text-2xl font-bold mb-4">{plant.plantName}</h1>

        {/* Progress */}
        <p className="text-gray-700 mb-2">
          Steps Completed: {doneCount}/{totalSteps}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Steps */}
        {plant.steps && (
          <div className="space-y-6">
            {plant.steps.map((step: any, idx: number) => (
              <div
                key={step._id}
                className="bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition-all duration-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {step.title}
                  </h2>
                  <input
                    type="checkbox"
                    checked={completed[idx]}
                    onChange={() => toggleStep(idx)}
                    className="h-5 w-5 accent-green-600"
                  />
                </div>
                <p className="text-gray-600 mb-2">{step.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Estimated Time: {step.estimatedTime}
                  </span>
                  <span
                    className={`${
                      completed[idx] ? "text-green-500" : "text-gray-500"
                    } text-sm font-semibold`}
                  >
                    {completed[idx] ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Talk to Plant Doctor Button */}
        <div className="mt-6">
          <button
            onClick={handleTalkToDoctor}
            disabled={isLoading}
            className={`w-full py-2 text-white rounded-md transition-all duration-300 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-t-transparent border-green-600 rounded-full animate-spin"></div>
                <span className="ml-3">Loading...</span>
              </div>
            ) : (
              "Check my plant health"
            )}
          </button>
        </div>
      </div>

      <ChatToggle />
    </main>
  );
}
