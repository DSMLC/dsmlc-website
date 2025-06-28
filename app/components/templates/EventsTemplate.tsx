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
          className="border rounded-xl shadow p-6 bg-white dark:bg-gray-800"
        >
          <span className="text-dsmlcTangerine font-semibold text-base md:text-lg">
            {event.title}
          </span>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
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
