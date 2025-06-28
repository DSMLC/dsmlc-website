import React from "react";
import { usePathname } from "next/navigation";
import ApplicationTemplate from "./ApplicationTemplate";

const EventCardsTemplate = ({ Data }: { Data: any[] }) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const eventsToDisplay = isHomePage ? Data.slice(0, 3) : Data;

  if (!eventsToDisplay || eventsToDisplay.length === 0) {
    return (
      <p className="text-center text-gray-600 dark:text-gray-400">
        No upcoming events at the moment.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {eventsToDisplay.map((event, index) => (
        <div
          key={index}
          className="p-6 mb-8 bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite border dark:border-dark-dsmlcEnhancedParchment border-light-dsmlcEnhancedParchment shadow-lg dark:shadow-dark-dsmlcParchment shadow-light-dsmlcParchment rounded-4xl"
        >
          <span className="font-redHat text-dsmlcTangerine font-semibold text-base md:text-lg">
            {event.title}
          </span>
          {event.date && (
            <p className="font-redHat text-sm text-gray-500 mb-2">
              {new Date(event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
          <p className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack md:text-base text-xs md:px-0 px-10 md:text-start text-center">
            {event.description}
          </p>
          {event.signup && event.signup.link && event.signup.link !== "#" ? (
            <div className="pt-4">
              <ApplicationTemplate Data={[event.signup]} />
            </div>
          ) : (
            <div className="pt-4">
              <p className="text-sm text-gray-500 italic">
                Sign-up Not Required.
              </p>
              <ApplicationTemplate Data={[event.signup]} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventCardsTemplate;
