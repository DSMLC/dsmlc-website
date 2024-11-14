import React from "react";
import rawData from "../../../public/data/page_data/sponsors.json";
import DataLoader, { PageData } from "@/app/DataLoader";

const SponsorsData: PageData[] = rawData as PageData[];

const page = () => {
  return (
    <div>
      {SponsorsData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
    </div>
  );
};

export default page;
