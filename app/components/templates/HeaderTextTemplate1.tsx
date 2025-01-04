import { HeaderTextTemplateData1 } from "@/app/DataLoader";
import React from "react";

const HeaderTextTemplate = ({
  Data,
}: {
  Data: HeaderTextTemplateData1["data"];
}) => {
  return (
    <div className="relative w-full">
      {Data.map((data, index) => (
        <div key={index} className="mb-14 relative">
          <div
            className={`absolute top-0 ${
              index % 2 === 0
                ? "lg:left-0 lg:rounded-r-full"
                : "lg:right-0 lg:rounded-l-full"
            } xl:w-5/6 lg:w-11/12 w-full h-full dark:bg-dark-dsmlcParchment bg-light-dsmlcParchment`}
          ></div>
          <div className="relative z-10 flex flex-col items-center px-4 py-16 lg:py-20">
            <div className="text-start lg:text-3xl md:text-2xl text-xl font-bold font-redHat text-dsmlcDataOrange mb-7">
              {data.header}
            </div>
            <div
              className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack tracking-wide max-w-3xl font-quicksand lg:text-lg md:text-base text-sm text-start"
              dangerouslySetInnerHTML={{ __html: data.text }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeaderTextTemplate;
