import React from "react";
import rawData from "../../../public/data/page_data/club_history.json";
import DataLoader, { PageData } from "@/app/DataLoader";

const ClubHistoryData: PageData[] = rawData as PageData[];

const page = () => {
  return (
    <div>
      {ClubHistoryData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
    </div>
  );
};

export default page;
