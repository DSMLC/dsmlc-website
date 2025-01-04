"use client";
import { SubtitleTemplateData1 } from "@/app/DataLoader";
import React from "react";

const SubtitleTemplate = ({
  Data,
}: {
  Data: SubtitleTemplateData1["data"];
}) => {
  return (
    <div className="lg:text-3xl md:text-2xl text-xl font-bold font-redHat text-dsmlcTangerine uppercase">
      {Data}
    </div>
  );
};

export default SubtitleTemplate;
