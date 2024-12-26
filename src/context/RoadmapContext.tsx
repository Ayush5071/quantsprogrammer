"use client";
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import Cookies from "js-cookie";

interface RoadmapContextType {
  checkedData: { [key: string]: string[] };
  setCheckedData: (topic: string, data: string[]) => void;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export function useRoadmapContext() {
  const context = useContext(RoadmapContext);
  if (!context) {
    throw new Error("useRoadmapContext must be used within a RoadmapProvider");
  }
  return context;
}

interface RoadmapProviderProps {
  children: ReactNode;
}

export const RoadmapProvider: React.FC<RoadmapProviderProps> = ({ children }) => {
  const [checkedData, setCheckedDataState] = useState<{ [key: string]: string[] }>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      console.log("User is logged in. Fetching roadmap data...");
      setIsLoggedIn(true);
      const fetchCheckedData = async () => {
        try {
          const response = await fetch("/api/roadmap/fetchall");
          const data = await response.json();

          if (data.error) {
            console.error("Error fetching roadmap data:", data.error);
            setError(data.error);
          } else {
            console.log("Roadmap data fetched successfully:", data);
            setCheckedDataState(data.checkedData || {});
          }
        } catch (error: any) {
          console.error("Error fetching roadmap data:", error);
          setError(error.message || "An unexpected error occurred");
        } finally {
          setLoading(false);
        }
      };

      fetchCheckedData();
    } else {
      console.log("No token found. User is not logged in.");
      setLoading(false);
    }
  }, []);

  const setCheckedData = (topic: string, data: string[]) => {
    console.log(`Updating checked data for topic: ${topic}`);
    setCheckedDataState((prevState) => ({
      ...prevState,
      [topic]: data,
    }));
  };

  const contextValue: RoadmapContextType = {
    checkedData,
    setCheckedData,
    isLoggedIn,
    loading,
    error,
  };

  return (
    <RoadmapContext.Provider value={contextValue}>
      {children}
    </RoadmapContext.Provider>
  );
};
