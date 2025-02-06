"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ThemeContextType {
  showSidebar: boolean;
  toggleSidebar: () => void;
}

const ThemeContext = createContext({} as ThemeContextType);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        showSidebar,
        toggleSidebar,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
