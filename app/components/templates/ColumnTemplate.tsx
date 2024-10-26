import React from "react";
import Image from "next/image";
import SubtitleTemplate3 from "./SubtitleTemplate3";
import ImageTemplate from "./ImageTemplate";

interface columnData {
  header: string;
  text: string;
  imageLink?: string;
}

const ColumnTemplate = ({ Data }: { Data: columnData[] }) => {
  return (
    <div className="pb-16 md:text-start text-center grid gap-14 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:w-full max-w-4xl w-fit m-auto items-stretch">
      {Data.map((data) => {
        return (
          <div className="flex flex-col gap-7 px-5 lg:px-0 lg:pt-11 lg:w-full max-w-4xl w-fit m-auto h-full">
            <div className="flex justify-center">
              <ImageTemplate
                image={data.imageLink || ""}
                name={data.imageLink || ""}
              />
            </div>
            <SubtitleTemplate3 Subtitle={data.header} />
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
