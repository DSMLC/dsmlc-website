import React from "react";
import rawData from "../../../public/data/page_data/partner_benefits.json";
import DataLoader, { PageData } from "@/app/DataLoader";

const partnerBenefitsData: PageData[] = rawData as PageData[];

const page = () => {
  return (
    <div>
      {partnerBenefitsData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
    </div>
  );
};

export default page;
