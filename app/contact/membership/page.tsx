"use client";

import React from "react";
import rawData from "../../../public/data/page_data/contact_membership.json";
import DataLoader, { PageData } from "@/app/DataLoader";

const MembershipData: PageData[] = rawData as PageData[];

export default function Component() {
  return (
    <div>
      {MembershipData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
    </div>
  );
}
