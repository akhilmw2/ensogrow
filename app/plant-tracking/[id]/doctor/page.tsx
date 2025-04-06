'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { diagnosePlant } from '@/lib/api';

export default function PlantDoctorPage() {
  const { id: plantId } = useParams();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);

  // Diagnosis states
  const [doctorRawText, setDoctorRawText] = useState('');
  const [doctorSteps, setDoctorSteps] = useState<any[]>([]);
  const [hasResponse, setHasResponse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Request camera access on mount
  useEffect(() => {
    async function initCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Unable to access camera');
      }
    }
    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Capture photo from video stream
  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
          setCapturedFile(file);
        }
      }, 'image/jpeg');
    }
  };

  // Convert file to base64 string (without prefix)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1] || '');
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Send captured image to backend as JSON payload
  const handleSendToDoctor = async () => {
    if (!capturedFile) {
      setError('No image captured');
      return;
    }
    setError(null);
    setLoading(true);
    setHasResponse(false);
    setDoctorRawText('');
    setDoctorSteps([]);

    try {
      const base64 = await fileToBase64(capturedFile);
      // Build JSON payload
      const payload = { imageBase64: base64 };

      // Call backend diagnose endpoint
      const res = await diagnosePlant(plantId, payload);
      const { rawText, steps } = res.data;

      setDoctorRawText(rawText);
      setHasResponse(true);

      if (rawText.trim() !== '-1' && steps?.length) {
        setDoctorSteps(steps);
      }
    } catch (err: any) {
      console.error('Error diagnosing plant:', err);
      if (err.response && err.response.status === 422) {
        setError('The image could not be processed.');
        setDoctorRawText('The image could not be processed.');
      } else {
        setError(err.message || 'Error diagnosing plant');
        setDoctorRawText(err.message || 'Error diagnosing plant');
      }
      setHasResponse(true);
    } finally {
      setLoading(false);
    }
  };

  // OK button handler: navigate back to plant tracking page
  const handleOkClick = () => {
    router.push(`/plant-tracking/${plantId}`);
  };

  return (
    <main className="max-w-xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4">
        Talk to Plant Doctor (Plant ID: {plantId})
      </h1>

      {/* Show live camera preview if no photo captured */}
      {!capturedFile ? (
        <div className="mb-6">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-64 object-cover rounded mb-4 bg-black"
          />
          <button
            onClick={handleCapture}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
          >
            Capture Photo
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <p className="mb-2 font-semibold">Captured Image:</p>
          <img
            src={URL.createObjectURL(capturedFile)}
            alt="Captured"
            className="w-full h-64 object-cover rounded mb-4"
          />
        </div>
      )}

      {/* Button to send photo to backend */}
      {capturedFile && (
        <button
          onClick={handleSendToDoctor}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Send to Doctor'}
        </button>
      )}

      {/* Display error/diagnosis result in text area */}
      {(hasResponse || error) && (
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
    </main>
  );
}
