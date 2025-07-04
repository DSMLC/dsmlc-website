"use client";

import { updateButtonClicksDatabase } from "@/app/Backend";
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

  if (!Data || !Array.isArray(Data)) return null;

  return (
    <div className="max-w-4xl w-full m-auto p-3 sm:p-5 flex md:flex-row flex-col gap-5 items-center">
      {Data.map((button, index) => {
        const isExternalLink =
          button.link.startsWith("http") &&
          !button.link.includes(window.location.hostname);
        return (
          <motion.div
            key={index}
            className="w-full flex justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href={button.link}
              target={isExternalLink ? "_blank" : "_self"}
              rel={isExternalLink ? "noopener noreferrer" : undefined}
              className={`group relative inline-flex items-center justify-center px-14 py-4 
    md:text-lg sm:text-base text-sm font-bold tracking-wider ${
      button.link === "#"
        ? "text-gray-400 bg-gray-300 cursor-not-allowed"
        : "text-light-dsmlcBlack bg-dsmlcTangerine shadow-2xl transition-all duration-300 ease-out"
    } 
    rounded-full overflow-hidden 
    focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      button.link === "#"
        ? "focus:ring-transparent"
        : "focus:ring-dsmlcTangerine"
    }`}
              onMouseEnter={() => button.link !== "#" && setHoveredIndex(index)}
              onMouseLeave={() => button.link !== "#" && setHoveredIndex(null)}
              onClick={(e) => {
                updateButtonClicksDatabase(button.name);
                if (button.link === "#") {
                  e.preventDefault(); // Prevent click action if the link is disabled
                }
              }}
            >
              <span className="relative z-10">{button.name}</span>
              {button.link !== "#" && (
                <>
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
                </>
              )}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ApplicationSection;
