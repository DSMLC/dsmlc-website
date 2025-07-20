import React from "react";
import rawData from "../../../public/data/page_data/games.json";
import DataLoader, { PageData } from "../../DataLoader";

const GamesData: PageData[] = rawData as PageData[];

const page = () => {
  return (
    <div>
      {GamesData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
    </div>
  );
};

export default page;
