import React from "react";
import rawData from "../../public/data/page_data/events.json";
import DataLoader, { PageData } from "../DataLoader";

const page = () => {
  const eventsData: PageData[] = rawData as PageData[];
  return (
    <div>
      {eventsData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
    </div>
  );
};

export default page;
