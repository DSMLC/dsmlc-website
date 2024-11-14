import React from "react";
import rawData from "../../public/data/page_data/about.json";
import DataLoader, { PageData } from "../DataLoader";

const AboutData: PageData[] = rawData as PageData[];

const page = () => {
  return (
    <div>
      {AboutData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
    </div>
  );
};

export default page;
