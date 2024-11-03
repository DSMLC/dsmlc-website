import React from "react";
import SubtitleTemplate from "./SubtitleTemplate1";
import { HeaderTextTemplateData2 } from "@/app/DataLoader";

const HeaderTextTemplate2 = ({
  Data,
}: {
  Data: HeaderTextTemplateData2["data"];
}) => {
  return (
    <div className="flex flex-col w-full items-center">
      {Data.map((data) => {
        return (
          <div className="flex flex-col gap-7 lg:px-0 px-5 pb-10 lg:w-full max-w-4xl w-fit m-auto lg:text-start text-center">
            <SubtitleTemplate Data={data.header} />
            <div
              className="text-dsmlcBlack tracking-wide max-w-3xl font-quicksand lg:text-lg md:text-base text-sm"
              dangerouslySetInnerHTML={{ __html: data.text }}
            ></div>
          </div>
        );
      })}
    </div>
  );
};

export default HeaderTextTemplate2;
