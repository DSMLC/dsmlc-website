"use client";
import React from "react";
import { SubHeaderTextTemplateData } from "../../DataLoader";

const SubHeaderTextTemplate = ({
  Data,
}: {
  Data: SubHeaderTextTemplateData["data"];
}) => {
  return (
    <>
      {Data.map((data, index) => {
        return (
          <div
            key={index}
            className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack tracking-wide max-w-3xl font-quicksand lg:text-lg md:text-base text-sm h-full"
          >
            <span className="font-bold">{data.header}</span>{" "}
            <span>{data.text}</span>
          </div>
        );
      })}
    </>
  );
};

export default SubHeaderTextTemplate;
