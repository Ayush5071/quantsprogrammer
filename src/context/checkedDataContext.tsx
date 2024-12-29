"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

interface CheckedDataContextType {
  isLoggedIn: boolean;
}

const CheckedDataContext = createContext<CheckedDataContextType | undefined>(undefined);

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, []);

  const contextValue: CheckedDataContextType = {
    isLoggedIn,
  };

  return (
    <CheckedDataContext.Provider value={contextValue}>
      {children}
    </CheckedDataContext.Provider>
  );
};
