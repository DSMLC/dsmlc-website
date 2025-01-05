"use client";
import React from "react";
import SubtitleTemplate3 from "./SubtitleTemplate3";
import { HeaderTextTemplateData4 } from "@/app/DataLoader";

const HeaderTextTemplate4 = ({
  Data,
}: {
  Data: HeaderTextTemplateData4["data"];
}) => {
  return (
    <div className="flex flex-col w-full items-center pb-8 gap-10">
      {Data.map((data, index) => {
        return (
          <div
            key={index}
            className="flex flex-col gap-3 lg:px-0 px-5 lg:w-full max-w-4xl w-fit m-auto text-start"
          >
            <SubtitleTemplate3 Data={data.header} />
            {data.text && data.text.map((text, index) => (
              <ul
                key={index}
                className="lg:text-lg md:text-base text-sm dark:text-dark-dsmlcBlack text-light-dsmlcBlack list-disc pl-5"
              >
                <li>{text}</li>
              </ul>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default HeaderTextTemplate4;
