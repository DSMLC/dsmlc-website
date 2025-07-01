import React from "react";
import { usePathname } from "next/navigation";
import ApplicationTemplate from "./ApplicationTemplate";

const CardTemplate = ({ Data }: { Data: any[] }) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isWorkshop = pathname === "/events/workshops";
  const CardToDisplay = isHomePage || isWorkshop ? Data.slice(0, 3) : Data;

  if (!CardToDisplay || CardToDisplay.length === 0) {
    return (
      <p className="text-center text-gray-600 dark:text-gray-400">
        No upcoming events at the moment.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

          {card.signup ? (
            card.signup.link && card.signup.link !== "#" ? (
              <div className="pt-4">
                <ApplicationTemplate Data={[card.signup]} />
              </div>
            ) : (
              <div className="pt-4">
                <p className="text-sm text-gray-500 italic">
                  Sign-up Not Required.
                </p>
                <ApplicationTemplate Data={[card.signup]} />
              </div>
            )
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default CardTemplate;
