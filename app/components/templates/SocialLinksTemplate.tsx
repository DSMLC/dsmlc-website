"use client";

import React, { useState } from "react";
import Image from "next/image";
import ClubLinks from "../../../public/data/club_links.json";
import { useTheme } from "../../ThemeProvider";
import { motion } from "framer-motion";
import { SocialLinksTemplateData } from "@/app/DataLoader";
import { updateButtonClicksDatabase } from "@/app/Backend";

export const socialMedia = [
  ClubLinks.discord,
  ClubLinks.insta,
  ClubLinks.linkedin,
  ClubLinks.linktree,
];

const SocialLinksTemplate = ({
  Data,
}: {
  Data: SocialLinksTemplateData["data"];
}) => {
  const { isDarkMode } = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.2,
      rotate: 3,
      transition: { type: "spring", stiffness: 300 },
    },
    tap: { scale: 0.95, rotate: 3 },
  };

  return (
    <div className="flex flex-wrap justify-center gap-6 p-4">
      {Object.values(socialMedia).map((app, index) => (
        <motion.div
          key={index}
          className="relative"
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          animate={hoveredIndex === index ? "hover" : "initial"}
          onHoverStart={() => setHoveredIndex(index)}
          onHoverEnd={() => setHoveredIndex(null)}
        >
          <motion.div
            className={`
              flex items-center justify-center w-12 h-12 rounded-full
              dark:bg-light-dsmlcBlack bg-dark-dsmlcBlack
              hover:shadow-xl transition-shadow duration-300 dark:shadow-dark-dsmlcParchment shadow-light-dsmlcParchment
            `}
            variants={iconVariants}
          >
            <a
              href={app.link}
              onClick={() => updateButtonClicksDatabase(`Go ${app.name}`)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${app.name} profile`}
              className="flex items-center justify-center w-full h-full"
            >
              <Image
                src={isDarkMode ? app.light_logo : app.dark_logo}
                alt={`${app.name} Logo`}
                width={24}
                height={24}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </a>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default SocialLinksTemplate;
