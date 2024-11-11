"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define the Context interface
interface UserContextType {
  token: string;
  setToken: (token: string) => void;
}

// Create the Context
const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Initialize token from localStorage
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    setToken(storedToken);
  }, []);

  // Update the token and store it in localStorage
  const updateToken = (newToken: string | null) => {
    if (newToken) {
      setToken(newToken);
      localStorage.setItem("token", newToken);
    } else {
      setToken("");
      localStorage.removeItem("token");
    }
  };

  return <UserContext.Provider value={{ token, setToken: updateToken }}>{children}</UserContext.Provider>;
};

// Custom Hook to access the Context
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
