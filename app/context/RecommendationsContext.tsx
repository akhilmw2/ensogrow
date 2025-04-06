"use client";

import { getCookie } from "@/lib/cookies";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  name?: string; // e.g. for "Spinach"
  plantName?: string; // if your API uses plantName
  imageUrl?: string;
  successRate?: number | string;
  steps?: Step[];
  [key: string]: any; // catch-all for extra props
}

// 2. Define the context value
interface RecommendationsContextValue {
  recommendations: Recommendation[];
  setRecommendations: (data: Recommendation[]) => void;
  location: string;
  setLocation: (data: string) => void;
  width: string;
  setWidth: (data: string) => void;
  height: string;
  setHeight: (data: string) => void;
  sunlightHours: number;
  setSunlightHours: (data: number) => void;
}

// 3. Create context
const RecommendationsContext = createContext<RecommendationsContextValue>({
  recommendations: [],
  setRecommendations: () => {},
  location: "",
  setLocation: () => {},
  width: "",
  setWidth: () => {},
  height: "",
  setHeight: () => {},
  sunlightHours: 0,
  setSunlightHours: () => {},
});

// 4. Provide context
export function RecommendationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [location, setLocation] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [sunlightHours, setSunlightHours] = useState<number>(0);
  const { replace } = useRouter();

  useEffect(() => {
    const token = getCookie("accessToken");
    if (!token) {
      replace("/login");
    }
  }, []);

  const recommendationContext = useMemo(
    () => ({
      recommendations,
      setRecommendations,
      location,
      setLocation,
      width,
      setWidth,
      height,
      setHeight,
      sunlightHours,
      setSunlightHours,
    }),
    [
      recommendations,
      setRecommendations,
      location,
      setLocation,
      width,
      setWidth,
      height,
      setHeight,
      sunlightHours,
      setSunlightHours,
    ]
  );

  return (
    <RecommendationsContext.Provider value={recommendationContext}>
      {children}
    </RecommendationsContext.Provider>
  );
}

// 5. Custom hook to use context
export function useRecommendations() {
  return useContext(RecommendationsContext);
}
