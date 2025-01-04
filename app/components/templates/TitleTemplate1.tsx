"use client";
import { TitleTemplateData1 } from "@/app/DataLoader";
import React from "react";

const TitleTemplate = ({ Data }: { Data: TitleTemplateData1["data"] }) => {
  return (
    <div className="flex flex-col border-b-2 dark:border-dark-dsmlcBlack border-light-dsmlcBlack border-opacity-25 pt-5 lg:w-full max-w-4xl w-fit m-auto pb-5 gap-3 mb-16">
      <h1 className="font-redHat font-[750] md:text-5xl text-4xl lg:text-start text-center text-dsmlcTangerine">
        {Data.title}
      </h1>
      <h2 className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack md:text-lg text-sm md:px-0 px-10 md:text-start text-center">
        {Data.subtitle}
      </h2>
    </div>
  );
};

export default TitleTemplate;
