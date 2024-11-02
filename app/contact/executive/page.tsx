import React from "react";
import rawData from "../../../public/data/page_data/contact_executive.json";
import DataLoader, { PageData } from "@/app/DataLoader";

const ApplicationData: PageData[] = rawData as PageData[];

export default function ApplyPage() {
  return (
    <div>
      {ApplicationData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
    </div>
  );
}
