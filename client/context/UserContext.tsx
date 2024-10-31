import React, { createContext, useContext, useState, ReactNode } from "react";

// Create Context
const UserContext = createContext<{ value: string; setValue: (value: string) => void } | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [value, setValue] = useState("Hello, world!");
  return <UserContext.Provider value={{ value, setValue }}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};
