"use client";
import React from "react";
import { HeaderTextTemplateData3 } from "../../DataLoader";

const HeaderTextTemplate3 = ({
  Data,
}: {
  Data: HeaderTextTemplateData3["data"];
}) => {
  return (
    <>
      {Data.map((data, index) => {
        return (
          <div
            key={index}
            className="mb-5 dark:text-dark-dsmlcBlack text-light-dsmlcBlack tracking-wide max-w-3xl font-quicksand lg:text-lg md:text-base text-sm h-full"
          >
            <span
              className="font-bold"
              dangerouslySetInnerHTML={{ __html: data.header }}
            ></span>{" "}
            <span>{data.text}</span>
          </div>
        );
      })}
    </>
  );
};

export default HeaderTextTemplate3;
