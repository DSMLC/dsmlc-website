import React from "react";
import rawData from "../../../public/data/page_data/upcoming.json";
import DataLoader, { PageData } from "../../DataLoader";

const UpcomingEventsData: PageData[] = rawData as PageData[];

const page = () => {
  return (
    <div>
      {UpcomingEventsData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
    </div>
  );
};

export default page;
