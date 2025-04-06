"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPlanDetail, completeStep } from "@/lib/api";
import ChatToggle from "@/components/chatbot/ChatToggle";

export default function PlantTrackingPage() {
  const { id } = useParams(); // plantId
  const [plant, setPlant] = useState<any>(null);
  const [completed, setCompleted] = useState<boolean[]>([]);

  useEffect(() => {
    async function fetchPlant() {
      try {
        const res = await getPlanDetail(id);
        // Suppose res = { message: "...", data: { steps: [...], ... } }
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
    // 1. Flip the local state so the UI updates immediately
    setCompleted((prev) => {
      const newArr = [...prev];
      newArr[index] = !newArr[index];
      return newArr;
    });

    // 2. Call the backend to mark the step in DB
    try {
      const stepId = plant.steps[index]?.id; // or step._id if numeric vs string
      if (stepId !== undefined) {
        await completeStep(plant._id, stepId);
      }
    } catch (err) {
      console.error("Error completing step:", err);
      // If it fails, you might revert the UI state or show an error
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        {/* Plant Image */}
        {plant.imageUrl && (
          <img
            src={plant.imageUrl}
            alt={plant.plantName}
            className="w-full h-64 object-cover rounded mb-4"
          />
        )}
        <h1 className="text-2xl font-bold mb-2">{plant.plantName}</h1>

        {/* Progress */}
        <p className="text-gray-700 mb-2">
          Steps Completed: {doneCount}/{totalSteps}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Checkboxes */}
        {plant.steps && (
          <div className="text-left w-full mb-6">
            <h2 className="text-lg font-semibold mb-2">Follow these steps:</h2>
            <ul className="space-y-3">
              {plant.steps.map((step: any, idx: number) => (
                <li key={step._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={completed[idx]}
                    onChange={() => toggleStep(idx)}
                    className="h-4 w-4 accent-green-600"
                  />
                  <span
                    className={
                      completed[idx] ? "line-through text-gray-500" : ""
                    }
                  >
                    {step.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Talk to Plant Doctor Button */}
        <Link
          href={`/plant-tracking/${id}/doctor`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Talk to Plant Doctor
        </Link>
      </div>
      <ChatToggle />
    </main>
  );
}
