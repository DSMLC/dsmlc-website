import React from "react";

interface PageData {
  header: string;
  text: string;
}

const HeaderTextTemplate = ({ Data }: { Data: PageData[] }) => {
  return (
    <div className="flex flex-col w-full items-center lg:my-20 lg:gap-14 [&>*:nth-child(odd)]:bg-dsmlcDataOrange [&>*:nth-child(even)]:bg-dsmlcTangerine lg:[&>*:nth-child(odd)]:rounded-r-full lg:[&>*:nth-child(even)]:rounded-l-full lg:[&>*:nth-child(odd)]:mr-auto lg:[&>*:nth-child(even)]:ml-auto">
      {Data.map((data) => {
        return (
          <div className="flex gap-7 flex-col p-16 lg:py-16 py-28 lg:pt-11 lg:px-0 lg:w-11/12 w-full items-center">
            <div className="lg:text-3xl md:text-2xl text-xl text-dsmlcWhite font-bold font-redHat">
              {data.header}
            </div>{" "}
            <div
              className="text-dsmlcWhite tracking-wide max-w-3xl font-quicksand lg:text-lg md:text-base text-sm"
              dangerouslySetInnerHTML={{ __html: data.text }}
            ></div>
          </div>
        );
      })}
    </div>
  );
};

export default HeaderTextTemplate;
