import React from "react";
import SubHeaderTextTemplate from "./SubHeaderTextTemplate";
import SubtitleTemplate3 from "./SubtitleTemplate3";
import { SectionedHeaderTemplateData } from "@/app/DataLoader";

const SectionedHeaderTemplate = ({
  Data,
}: {
  Data: SectionedHeaderTemplateData["data"];
}) => {
  return (
    <div className="flex flex-col w-full items-center pb-16 gap-10">
      {Data.map((data) => {
        return (
          <div className="flex flex-col gap-3 lg:px-0 px-5 lg:w-full max-w-4xl w-fit m-auto text-start">
            <SubtitleTemplate3 Data={data.header} />
            <SubHeaderTextTemplate Data={data.subheaders} />
          </div>
        );
      })}
    </div>
  );
};

export default SectionedHeaderTemplate;
