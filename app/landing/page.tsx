'use client';
import { useState } from "react";
import { postCropRecommendation } from "@/lib/api";


export default function QuestionnairePage() {
    const [location, setLocation] = useState('');
    const [balconyDirection, setBalconyDirection] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [sunlightHours, setSunlightHours] = useState<number>(0);

    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const formData = {
            location,
            balconyDirection,
            space: `${width}ft x ${height}ft`,
            sunlightHours,
        };

        try {
            const data = await postCropRecommendation(formData);
            // data should be something like { recommendations: [...] }
            setRecommendations(data.recommendations || []);
        } catch (err: any) {
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

                {/* <div>
                    <label className="block mb-1 font-medium" htmlFor="balconyDirection">
                        Balcony Direction
                    </label>
                    <select
                        id="balconyDirection"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        value={balconyDirection}
                        onChange={(e) => setBalconyDirection(e.target.value)}
                        required
                    >
                        <option value="">Select direction</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                        <option value="North-East">North-East</option>
                        <option value="North-West">North-West</option>
                        <option value="South-East">South-East</option>
                        <option value="South-West">South-West</option>
                    </select>
                </div> */}

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

            {recommendations.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Recommended Plants</h2>
                    <ul className="space-y-2">
                        {recommendations.map((rec, idx) => (
                            <li
                                key={idx}
                                className="border border-gray-300 rounded p-4"
                            >
                                <p className="font-bold">{rec.plantName}</p>
                                <p>Planting Season: {rec.plantingSeason}</p>
                                <p>Yield Expectation: {rec.yieldExpectation}</p>
                                <p>Notes: {rec.notes}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </main>
    );
}