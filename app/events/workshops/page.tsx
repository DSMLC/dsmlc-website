import React from "react";
import rawData from "../../../public/data/page_data/workshops.json";
import DataLoader, { PageData } from "../../DataLoader";

const WorkshopData: PageData[] = rawData as PageData[];

const page = () => {
  return (
    <div>
      {WorkshopData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
    </div>
  );
};

export default page;
