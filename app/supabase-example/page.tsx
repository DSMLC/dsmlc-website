"use client";
import React from "react";
import DataLoader, { PageData } from "../DataLoader";
import rawData from "../../public/data/page_data/contact.json";
import MembersList from "../components/MembersList";

const ContactData: PageData[] = rawData as PageData[];
export default function ContactPage() {
  return (
    <div>
      <MembersList />
    </div>
  );
}
