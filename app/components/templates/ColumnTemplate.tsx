"use client";
import React from "react";
import SubtitleTemplate3 from "./SubtitleTemplate3";
import ImageTemplate, { ImageType } from "./ImageTemplate";
import { ColumnTemplateData } from "@/app/DataLoader";
import { useTheme } from "@/app/ThemeProvider";

const ColumnTemplate = ({ Data }: { Data: ColumnTemplateData["data"] }) => {
  const { isDarkMode } = useTheme();
  const itemCount = Data.length;

  const getGridClass = () => {
    if (itemCount <= 3) {
      switch (itemCount) {
        case 1:
          return "grid-cols-1";
        case 2:
          return "md:grid-cols-2 grid-cols-1";
        case 3:
          return "lg:grid-cols-3 md:grid-cols-2 grid-cols-1";
      }
    }
    return "lg:grid-cols-3 md:grid-cols-2 grid-cols-1";
  };

  const remainder = itemCount % 3;
  const fullRowCount = itemCount - remainder;
  const fullRowItems = Data.slice(0, fullRowCount);
  const lastRowItems = remainder !== 0 ? Data.slice(fullRowCount) : [];

  const renderItem = (
    data: ColumnTemplateData["data"][number],
    index: number,
  ) => {
    const imageLink =
      isDarkMode && data.image?.imageDarkMode
        ? data.image.imageDarkMode
        : data.image?.imageLink;
    return (
      <div
        key={index}
        className="flex flex-col gap-7 px-5 lg:px-0 h-full w-full"
      >
        <div className="flex justify-center">
          {data.image && (
            <ImageTemplate
              image={imageLink || ""}
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
          />
        )}
      </div>
    );
  };

  return (
    <div className="pb-16 w-full max-w-6xl mx-auto">
      {/* Full rows in CSS grid */}
      {fullRowItems.length > 0 && (
        <div
          className={`text-center grid gap-14 ${getGridClass()} items-stretch justify-items-center`}
        >
          {fullRowItems.map((data, index) => renderItem(data, index))}
        </div>
      )}

      {/* Partial last row — flex centered, items match grid column width */}
      {lastRowItems.length > 0 && (
        <div
          className={`flex justify-center gap-14 ${
            fullRowItems.length > 0 ? "mt-14" : ""
          }`}
        >
          {lastRowItems.map((data, index) => (
            <div
              key={index}
              className="w-full lg:max-w-[calc(33.333%-1.75rem)] md:max-w-[calc(50%-1.75rem)] max-w-full"
            >
              {renderItem(data, index)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColumnTemplate;
