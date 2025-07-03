"use client";
import React from "react";
import { usePathname } from "next/navigation";
import ApplicationTemplate from "./ApplicationTemplate";

import { CardTemplateData } from "../../DataLoader";

const CardTemplate = ({ Data }: { Data: CardTemplateData["data"] }) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isWorkshop = pathname === "/events/workshops";

  // Check if Data is an array (parsed format)
  const isParsed = Array.isArray(Data);

  if (!isParsed) {
    return (
      <p className="text-center text-gray-600 dark:text-gray-400">
        Data format is not supported yet.
      </p>
    );
  }

  const CardToDisplay = isHomePage || isWorkshop ? Data.slice(0, 3) : Data;

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {CardToDisplay.map((card, index) => (
        <div
          key={index}
          className="p-6 mb-8 bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite border dark:border-dark-dsmlcEnhancedParchment border-light-dsmlcEnhancedParchment shadow-lg dark:shadow-dark-dsmlcParchment shadow-light-dsmlcParchment rounded-4xl"
        >
          {card.title && (
            <span className="font-redHat text-dsmlcTangerine font-semibold text-base md:text-lg">
              {card.title}
            </span>
          )}

          {card.timestamp && (
            <p className="font-redHat text-sm text-gray-500">
              {new Date(card.timestamp).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          )}

          {card.location && (
            <p className="font-redHat text-sm text-gray-500 mb-2">
              {card.location}
            </p>
          )}

          {card.description && (
            <p className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack md:text-base text-xs md:px-0 md:text-start">
              {card.description}
            </p>
          )}

          {card.button ? (
            card.button.link && card.button.link !== "#" ? (
              <div className="pt-4">
                <ApplicationTemplate Data={[card.button]} />
              </div>
            ) : (
              <div className="pt-4">
                <ApplicationTemplate Data={[card.button]} />
              </div>
            )
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default CardTemplate;
