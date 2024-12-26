"use client";
import { fetchDataFromAPI } from "@/helpers/fetchData";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

// Define the types for the context
interface CheckedDataContextType {
  checkedData: string[];  // Now an array of strings
  setCheckedData: React.Dispatch<React.SetStateAction<string[]>>; // Update the type accordingly
  isLoggedIn: boolean;
}

const CheckedDataContext = createContext<CheckedDataContextType | undefined>(undefined);

// Custom hook to access the context
export function useCheckedData() {
  const context = useContext(CheckedDataContext);
  if (!context) {
    throw new Error("useCheckedData must be used within a CheckedDataProvider");
  }
  return context;
}

interface CheckedDataProviderProps {
  children: ReactNode;
}

export const CheckedDataProvider: React.FC<CheckedDataProviderProps> = ({ children }) => {
  const [checkedData, setCheckedData] = useState<string[]>([]); // Use an array of strings
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      setIsLoggedIn(true);

      fetchDataFromAPI().then((data) => {
        if (data?.checkedData) {
          console.log("context ke ande checked data", data.checkedData);
          setCheckedData(data.checkedData);  
          console.log("set successfully");
        } else {
          const savedProgress = Cookies.get("roadmapProgress");
          if (savedProgress) {
            setCheckedData(JSON.parse(savedProgress));
          }
        }
        setLoading(false);
      });
    } else {
      const savedProgress = Cookies.get("roadmapProgress");
      if (savedProgress) {
        setCheckedData(JSON.parse(savedProgress)); // Ensure this is an array when parsing
      }
      console.log('came here')
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      Cookies.set("roadmapProgress", JSON.stringify(checkedData), { expires: 1 });
    }
  }, [checkedData, loading]);

  // Provide context values to the components
  const contextValue: CheckedDataContextType = {
    checkedData,
    setCheckedData,
    isLoggedIn,
  };

  return (
    <CheckedDataContext.Provider value={contextValue}>
      {children}
    </CheckedDataContext.Provider>
  );
};
