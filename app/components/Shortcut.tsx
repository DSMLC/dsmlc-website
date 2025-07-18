"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

type Anchor = {id: string; label: string};



export default function Shortcut({anchors}: {anchors: Anchor[]}) {


  const handleClick = (id: string) => {
    const target = document.getElementById(id);
    if (target){
      target.scrollIntoView({behavior: "smooth"});
    }
  };


  return (
    <div id="sidebar" className="fixed top-0 right-0 h-full w-64 bg-dark-dsmlcWhite text-white border-solid border-dsmlcDataOrange p-5 transform translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out z-50">
    <h2 className="text-2xl font-bold mb-6">ShortCut</h2>
    <ul className="space-y-4">
      {anchors.map((anchor) => (
        <li key={anchor.id}>
          <a
            href={`#${anchor.id}`} 
            className="hover:text-gray-300 cursor-pointer" 
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
