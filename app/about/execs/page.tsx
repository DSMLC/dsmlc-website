import React from "react";
import rawData from "../../../public/data/page_data/executive_roster.json";
import DataLoader, { PageData } from "@/app/DataLoader";

const ExecutiveRosterData: PageData[] = rawData as PageData[];

const page = () => {
  return (
    <div>
      {ExecutiveRosterData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
    </div>
  );
};

export default page;
