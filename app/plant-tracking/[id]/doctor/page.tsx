'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';


function cleanGeminiResponse(rawText: string) {
    // Remove the opening ```json and closing ```.
    // Then replace all newline characters with a single space.
    let cleaned = rawText
      .replace(/```json\s*/i, '') // remove ```json
      .replace(/```/g, '')        // remove final ```
      .replace(/\n+/g, ' ')       // remove newlines
      .trim();
  
    return cleaned;
  }

export default function PlantDoctorPage() {
  const params = useParams();
  const router = useRouter();
  const plantId = params.id;  // e.g. "2", "3", etc.

  // Local state for the uploaded file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // We'll store the entire raw text from Gemini and any parsed steps
  const [doctorRawText, setDoctorRawText] = useState<string>('');
  const [doctorSteps, setDoctorSteps] = useState<any[]>([]);

  // For user feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track if we got a response from Gemini (to show the text area + OK button)
  const [hasResponse, setHasResponse] = useState(false);

  // --- File Change Handler ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setSelectedFile(e.target.files[0] || null);
  };

  // --- Send to Doctor (Gemini) ---
  const handleSendToDoctor = async () => {
    if (!selectedFile) {
      setError('No file selected');
      return;
    }
    setError(null);
    setLoading(true);

    // Reset previous states
    setDoctorRawText('');
    setDoctorSteps([]);
    setHasResponse(false);

    try {
      // 1) Convert image file to base64
      const base64 = await fileToBase64(selectedFile);

      // 2) Build Gemini request body
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `You are a plant doctor. Analyze the plant in the following image.
                  If healthy, return "-1". Otherwise, return a JSON with "steps" array.`
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64
                }
              }
            ]
          }
        ]
      };

      // 3) Call Gemini
      const resp = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyB0E7PNDf6EzWckXcSY8m35da_-U2cCoUs',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      );

      console.log(resp.body);

      if (!resp.ok) {
        throw new Error(`Gemini API error: ${resp.status}`);
      }

      // Parse the JSON
      const data = await resp.json();
      const rawCandidate = data?.candidates?.[0]?.content;

      // In some cases, rawCandidate might be an object not a string – handle that:
      let resultText = '';
      if (typeof rawCandidate === 'string') {
        resultText = rawCandidate;
      } else if (rawCandidate) {
        // Convert object to a JSON string for display
        console.log(rawCandidate)
        resultText = JSON.stringify(rawCandidate, null, 2);
      }

      console.log('Gemini raw response:', resultText);

      // Store it so user can see it in a text area
      setDoctorRawText(resultText);
      setHasResponse(true);

      // 4) Check if it's '-1' or parse for steps
      if (resultText.trim?.() === '-1') {
        // It's healthy – no further steps
        // We'll handle next logic in handleOkClick
      } else {
        // Attempt to parse JSON for steps
        try {
          const parsed = JSON.parse(resultText);
          if (parsed?.steps) {
            setDoctorSteps(parsed.steps);
          } else {
            // setError('Response did not contain steps.');
          }
        } catch (err) {
        //   setError('Failed to parse steps JSON.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error calling Gemini');
    } finally {
      setLoading(false);
    }
  };

  // --- Convert File to Base64 ---
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // remove data:image/jpeg;base64, prefix
        resolve(result.split(',')[1] || '');
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // --- Handle "OK" Click ---
  const handleOkClick = async () => {
    // If doctorRawText is exactly '-1', just go back to plant tracking
    if (doctorRawText.trim?.() === '-1') {
      router.push(`/plant-tracking/${plantId}`);
      return;
    }

    // Otherwise, we have steps from doctorSteps – let's store them in the DB
    if (doctorSteps.length > 0) {
      try {
        // Example: calling a backend route to save steps
        // This is pseudo-code – adapt to your real API
        const saveResp = await fetch('/api/save-steps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plantId,
            newSteps: doctorSteps,
          }),
        });

        if (!saveResp.ok) {
          throw new Error(`Failed to save steps. Status = ${saveResp.status}`);
        }

        const saveData = await saveResp.json();
        if (!saveData.success) {
          throw new Error(`Backend error: ${saveData.error}`);
        }

        // After saving, navigate back
        router.push(`/plant-tracking/${plantId}`);
      } catch (err: any) {
        setError(err.message || 'Error saving steps to DB');
      }
    } else {
      // No steps in doctorSteps – just go back
      router.push(`/plant-tracking/${plantId}`);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4">
        Talk to Plant Doctor (Plant ID: {plantId})
      </h1>

      <div className="mb-6">
        <label className="block mb-2 font-semibold">Upload Plant Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border border-gray-300 p-2 rounded"
        />
      </div>

      <button
        onClick={handleSendToDoctor}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Send to Doctor'}
      </button>

      {error && (
        <p className="mt-4 text-red-600">
          Error: {error}
        </p>
      )}

      {/* If we have a response from Gemini, show it in a text area + "OK" button */}
      {hasResponse && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Doctor says:</h3>
          <textarea
            className="w-full border border-gray-300 rounded p-2"
            rows={6}
            value={doctorRawText}
            readOnly
          />

          <button
            onClick={handleOkClick}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            OK
          </button>
        </div>
      )}

      {/* If the doctor returned structured steps, we can show them below */}
      {doctorSteps.length > 0 && (
        <div className="mt-6 p-4 border border-gray-300 rounded">
          <h2 className="text-lg font-semibold mb-2">Doctor's Steps:</h2>
          <ul className="list-disc ml-6 space-y-2">
            {doctorSteps.map((step, idx) => (
              <li key={idx}>
                <p className="font-bold">{step.title}</p>
                <p className="text-sm text-gray-700">{step.description}</p>
                <p className="text-xs text-gray-500">
                  Estimated Time: {step.estimatedTime}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
