import React from "react";
import rawData from "../../public/data/page_data/visionary_lab.json";
import DataLoader, { PageData } from "../DataLoader";

const VisionaryLabData: PageData[] = rawData as PageData[];

const page = () => {
  return (
    <div>
      {VisionaryLabData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
    </div>
  );
};

export default page;
