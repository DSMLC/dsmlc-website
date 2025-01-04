"use client";
import { TitleTemplateData2 } from "@/app/DataLoader";
import React from "react";

const TitleTemplate2 = ({ Data }: { Data: TitleTemplateData2["data"] }) => {
  return (
    <>
      <h1 className="lg:text-5xl md:text-4xl text-3xl font-extrabold text-center text-dsmlcTangerine mb-5 font-redHat leading-tight pt-5">
        {Data.title}
      </h1>
      <p className="lg:text-2xl md:text-xl text-lg text-center dark:text-dark-dsmlcBlack text-light-dsmlcBlack mb-5 font-quicksand">
        {Data.subtitle}
      </p>
    </>
  );
};

export default TitleTemplate2;
