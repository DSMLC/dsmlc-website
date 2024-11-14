import React from "react";
import rawData from "../../../public/data/page_data/final_comp.json";
import DataLoader, { PageData } from "../../DataLoader";

const FinalCompData: PageData[] = rawData as PageData[];

const page = () => {
  return (
    <div>
      {FinalCompData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
    </div>
  );
};

export default page;
