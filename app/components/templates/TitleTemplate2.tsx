import { TitleTemplateData2 } from "@/app/DataLoader";
import React from "react";

const TitleTemplate2 = ({ Data }: { Data: TitleTemplateData2["data"] }) => {
  return (
    <>
      <h1 className="text-5xl font-extrabold text-center text-dsmlcTangerine mb-8 font-redHat leading-tight pt-20">
        {Data.title}
      </h1>
      <p className="text-2xl text-center dark:text-dark-dsmlcBlack text-light-dsmlcBlack mb-12 font-quicksand">
        {Data.subtitle}
      </p>
    </>
  );
};

export default TitleTemplate2;
