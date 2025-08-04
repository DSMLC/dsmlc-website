"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTheme } from "../ThemeProvider";




type Anchor = {id: string; label: string};



export default function Shortcut({anchors}: {anchors: Anchor[]}) {

  const {isDarkMode} = useTheme();

  const handleClick = (id: string) => {
    const target = document.getElementById(id);
    if (target){
      target.scrollIntoView({behavior: "smooth"});
    }
  };


  const sideBarBaseStyle = "fixed top-0 right-0 h-full w-64 border-solid p-5 pt-32 border-l-4 border-dsmlcTangerine transform translate-x-full xl:translate-x-0 transition-transform duration-300 ease-in-out z-10";
  return (
    <div id="sidebar" className={isDarkMode ? `${sideBarBaseStyle} bg-dark-dsmlcWhite/75 text-white` : `${sideBarBaseStyle} bg-light-dsmlcParchment/75 text-dark-dsmlcParchment`}>
    <h2 className="text-2xl font-bold mb-6">ShortCut</h2>
    <ul className="space-y-4">
      {anchors.map((anchor) => (
        <li 
        key={anchor.id} 
        className="hover:bg-dark-dsmlcEnhancedParchment hover:text-dsmlcTangerine cursor-pointer ease-in-out duration-150">
          <a
            href={`#${anchor.id}`} 
            className="cursor-pointer" 
            onClick={() => handleClick(anchor.id)}
          >
            {anchor.label}
          </a>
        </li>
      ))}
    </ul>
  </div>

  );
};
