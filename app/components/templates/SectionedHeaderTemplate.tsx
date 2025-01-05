"use client";
import React from "react";
import SubHeaderTextTemplate from "./SubHeaderTextTemplate";
import SubtitleTemplate3 from "./SubtitleTemplate3";
import { SectionedHeaderTemplateData } from "@/app/DataLoader";
import UpcomingEvents from "../../../public/data/upcoming_events.json";

const SectionedHeaderTemplate = ({
  Data,
}: {
  Data: SectionedHeaderTemplateData["data"];
}) => {
  const isUpcomingEvents = Data === "UpcomingEvents";
  const currentData = isUpcomingEvents
    ? UpcomingEvents
    : Array.isArray(Data)
    ? Data
    : [];
  return (
    <div className="flex flex-col w-full items-center pb-8 gap-10">
      {currentData.map((data, index) => {
        return (
          <div
            key={index}
            className="flex flex-col gap-3 lg:px-0 px-5 lg:w-full max-w-4xl w-fit m-auto text-start"
          >
            <SubtitleTemplate3 Data={data.header} />
            <SubHeaderTextTemplate Data={data.subheaders} />
          </div>
        );
      })}
    </div>
  );
};

export default SectionedHeaderTemplate;
