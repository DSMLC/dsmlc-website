"use client";
import { SubtitleTemplateData3 } from "@/app/DataLoader";
import React from "react";

const SubtitleTemplate3 = ({
  Data,
}: {
  Data: SubtitleTemplateData3["data"];
}) => {
  return (
    <div className="lg:text-2xl md:text-xl text-lg font-semibold font-redHat dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
      {Data}
    </div>
  );
};

export default SubtitleTemplate3;
