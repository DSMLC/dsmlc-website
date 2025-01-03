"use client";
import React from "react";
import { useTheme } from "../ThemeProvider";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  };

  return (
    <div
      onClick={toggleDarkMode}
      className={`bg-light-dsmlcEnhancedParchment dark:bg-dark-dsmlcEnhancedParchment 
      flex items-center w-16 h-8 rounded-full cursor-pointer transition-colors duration-300 relative p-1`}
    >
      <div
        className={`dark:translate-x-8 translate-x-0 dark:bg-dark-dsmlcWhite bg-light-dsmlcWhite border-light-dsmlcBlack dark:border-dark-dsmlcBlack absolute w-6 h-6 rounded-full border-2 transform transition-transform flex items-center justify-center`}
      >
        {isDarkMode ? (
          <FaMoon className="text-dsmlcDataOrange" />
        ) : (
          <FaSun className="text-dsmlcDataOrange" />
        )}
      </div>
    </div>
  );
};

export default ThemeToggle;
