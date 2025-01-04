import React from "react";
import SubtitleTemplate3 from "./SubtitleTemplate3";
import ImageTemplate, { ImageType } from "./ImageTemplate";
import { ColumnTemplateData } from "@/app/DataLoader";

const ColumnTemplate = ({ Data }: { Data: ColumnTemplateData["data"] }) => {
  const itemCount = Data.length;

  const getGridClass = () => {
    if (itemCount <= 3) {
      switch (itemCount) {
        case 1:
          return "grid-cols-1";
        case 2:
          return "sm:grid-cols-2 grid-cols-1";
        case 3:
          return "lg:grid-cols-3 sm:grid-cols-2 grid-cols-1";
      }
    }
    return "lg:grid-cols-3 sm:grid-cols-2 grid-cols-1";
  };

  const getItemClass = (index: number) => {
    if (itemCount <= 3) return "";

    const rowIndex = Math.floor(index / 3);
    const itemsInLastRow = itemCount % 3 || 3;
    const isLastRow = rowIndex === Math.floor((itemCount - 1) / 3);

    if (isLastRow) {
      if (itemsInLastRow === 1) {
        return "col-span-full sm:col-span-2 lg:col-span-1 sm:col-start-2 lg:col-start-2";
      } else if (itemsInLastRow === 2) {
        return index % 3 === 0 ? "sm:col-start-2 lg:col-start-2" : "";
      }
    }

    return "";
  };

  return (
    <div
      className={`pb-16 text-center grid gap-14 ${getGridClass()} w-full max-w-6xl mx-auto items-stretch justify-items-center`}
    >
      {Data.map((data, index) => (
        <div
          key={index}
          className={`flex flex-col gap-7 px-5 lg:px-0 lg:pt-11 h-full w-full ${getItemClass(
            index
          )}`}
        >
          <div className="flex justify-center">
            {data.image && (
              <ImageTemplate
                image={data.image.imageLink || ""}
                name={data.image.imageName || ""}
                type={data.image.imageType as ImageType}
              />
            )}
          </div>
          {data.header && <SubtitleTemplate3 Data={data.header} />}
          {data.text && (
            <div
              className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack tracking-wide font-quicksand lg:text-lg md:text-base text-sm h-full"
              dangerouslySetInnerHTML={{ __html: data.text }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ColumnTemplate;
