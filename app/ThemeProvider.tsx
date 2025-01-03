"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";

const ThemeContext = createContext<{
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isDarkMode: false,
  setIsDarkMode: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDarkMode(true);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

