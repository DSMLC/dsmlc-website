"use client";

import { ApplicationTemplateData } from "@/app/DataLoader";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const ApplicationSection = ({
  Data,
}: {
  Data: ApplicationTemplateData["data"];
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); 

  if (!Data?.button || !Array.isArray(Data.button)) return null;

  return (
    <div className="max-w-4xl w-full m-auto p-3 sm:p-5 flex md:flex-row flex-col gap-5 items-center">
      {Data.button.map((button, index) => (
        <motion.div
          key={index}
          className="w-full flex justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Link
            href={button.buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative inline-flex items-center justify-center px-14 py-4 
              md:text-lg sm:text-base text-sm font-bold tracking-wider text-light-dsmlcBlack
              rounded-full overflow-hidden shadow-2xl bg-dsmlcTangerine
              transition-all duration-300 ease-out
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dsmlcTangerine`}
            onMouseEnter={() => setHoveredIndex(index)} 
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span className="relative z-10">{button.buttonText}</span>
            <motion.span
              className="absolute right-4 transform -translate-y-1/2"
              initial={{ x: -10, opacity: 0 }}
              animate={{
                x: hoveredIndex === index ? 0 : -10,
                opacity: hoveredIndex === index ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="w-6 h-6" />
            </motion.span>
            <motion.span
              className="absolute inset-0 z-0 bg-dsmlcTangerine opacity-20"
              initial={{ scale: 0 }}
              animate={{
                scale: hoveredIndex === index ? 1.5 : 0,
              }}
              transition={{ duration: 0.4 }}
            />
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default ApplicationSection;
