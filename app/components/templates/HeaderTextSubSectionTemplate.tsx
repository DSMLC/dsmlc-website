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
        <div key={index} className="flex flex-col gap-3 mb-10">
          <span className="text-dsmlcTangerine font-bold lg:text-2xl md:text-xl text-lg">
            {data.title}
          </span>
          <div className="flex flex-col gap-5">
            {data.subSection.map((sub, subIndex) => (
              <div
                key={subIndex}
                className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack tracking-wide max-w-3xl font-quicksand lg:text-lg md:text-base text-sm h-full"
              >
                <span className="font-bold">{sub.header}</span>{" "}
                <span>{sub.text}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default HeaderTextSubSectionTemplate;
