import React from "react";
import SubtitleTemplate3 from "./SubtitleTemplate3";
import ImageTemplate from "./LogoImageTemplate";
import { ColumnTemplateData } from "@/app/DataLoader";

const ColumnTemplate = ({ Data }: { Data: ColumnTemplateData["data"] }) => {
  return (
    <div className="pb-16 text-center grid gap-14 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:w-full max-w-4xl w-fit m-auto items-stretch">
      {Data.map((data) => {
        return (
          <div className="flex flex-col gap-7 px-5 lg:px-0 lg:pt-11 lg:w-full max-w-4xl w-fit m-auto h-full">
            <div className="flex justify-center">
              <ImageTemplate
                image={data.imageLink || ""}
                name={data.imageLink || ""}
              />
            </div>
            <SubtitleTemplate3 Data={data.header} />
            <div
              className="text-dsmlcBlack tracking-wide max-w-3xl font-quicksand lg:text-lg md:text-base text-sm h-full"
              dangerouslySetInnerHTML={{ __html: data.text }}
            ></div>
          </div>
        );
      })}
    </div>
  );
};

export default ColumnTemplate;
