'use client';

import React, { createContext, useContext, useState } from 'react';

// 1. Define the shape of your data
interface Step {
  id: number;
  title: string;
  description: string;
  estimatedTime: string;
  isCompleted: boolean;
  _id?: string;
}

interface Recommendation {
  name?: string;          // e.g. for "Spinach"
  plantName?: string;     // if your API uses plantName
  imageUrl?: string;
  successRate?: number | string;
  steps?: Step[];
  [key: string]: any;     // catch-all for extra props
}

// 2. Define the context value
interface RecommendationsContextValue {
  recommendations: Recommendation[];
  setRecommendations: (data: Recommendation[]) => void;
}

// 3. Create context
const RecommendationsContext = createContext<RecommendationsContextValue>({
  recommendations: [],
  setRecommendations: () => {},
});

// 4. Provide context
export function RecommendationsProvider({ children }: { children: React.ReactNode }) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  return (
    <RecommendationsContext.Provider value={{ recommendations, setRecommendations }}>
      {children}
    </RecommendationsContext.Provider>
  );
}

// 5. Custom hook to use context
export function useRecommendations() {
  return useContext(RecommendationsContext);
}
