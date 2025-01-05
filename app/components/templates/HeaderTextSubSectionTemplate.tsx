"use client";
import React from "react";
import { HeaderTextSubSectionTemplateData } from "../../DataLoader";

const HeaderTextSubSectionTemplate = ({
  Data,
}: {
  Data: HeaderTextSubSectionTemplateData["data"];
}) => {
  return (
    <>
      {Data.map((data, index) => (
        <div key={index}>
          <span className="text-dsmlcTangerine font-bold lg:text-xl md:text-lg text-base">
            {data.title}
          </span>
          {data.subSection.map((sub, subIndex) => (
            <div
              key={subIndex}
              className="mb-5 dark:text-dark-dsmlcBlack text-light-dsmlcBlack tracking-wide max-w-3xl font-quicksand lg:text-lg md:text-base text-sm h-full"
            >
              <span className="font-bold">{sub.header}</span>{" "}
              <span>{sub.text}</span>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default HeaderTextSubSectionTemplate;
