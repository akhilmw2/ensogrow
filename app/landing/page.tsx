'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecommendations } from '@/app/context/RecommendationsContext';
import { postCropRecommendation } from '@/lib/api';

export default function QuestionnairePage() {
    const [location, setLocation] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [sunlightHours, setSunlightHours] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const { setRecommendations } = useRecommendations();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const formData = {
            location,
            sunlightHours,
            availableSpace: `${width}x${height} ft`
        };

        try {
            // 1. Call your backend
            const response = await postCropRecommendation(formData);
            // Suppose we get { data: [ ... ] } from the server
            if (response?.data) {
                console.log(response.data)
                // 2. Store the data in global context
                setRecommendations(response.data);
            }

            // 3. Navigate to /recommendations
            router.push('/recommendations');
        } catch (err) {
            setError('Error fetching recommendations. Please try again.');
        }
    };

    return (
        <main className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6">Balcony Garden Setup</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium" htmlFor="location">
                        Location
                    </label>
                    <input
                        id="location"
                        type="text"
                        placeholder="e.g. Chicago, IL"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium" htmlFor="space">
                        Space (Width × Height in ft)
                    </label>
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="Width"
                            className="w-1/2 border border-gray-300 rounded px-3 py-2"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="Height"
                            className="w-1/2 border border-gray-300 rounded px-3 py-2"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-medium" htmlFor="sunlightHours">
                        Hours of Direct Sunlight
                    </label>
                    <input
                        id="sunlightHours"
                        type="number"
                        min="0"
                        max="24"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        value={sunlightHours}
                        onChange={(e) => setSunlightHours(Number(e.target.value))}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                >
                    Get Recommendations
                </button>
            </form>



            {error && (
                <p className="mt-4 text-red-500">
                    {error}
                </p>
            )}
        </main>
    );
}
