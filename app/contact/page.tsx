"use client";
import React from "react";
import DataLoader, { PageData } from "../DataLoader";
import rawData from "../../public/data/page_data/contact.json";

const ContactData: PageData[] = rawData as PageData[];
export default function ContactPage() {
  return (
    <div>
      {ContactData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
    </div>
  );
}
