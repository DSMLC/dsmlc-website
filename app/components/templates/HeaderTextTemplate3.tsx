import React from "react";
import SubHeaderTextTemplate from "./SubHeaderTextTemplate";
import SubtitleTemplate3 from "./SubtitleTemplate3";

interface PageData2 {
  header: string;
  subheaders: {
    header: string;
    text: string;
  }[];
}

const HeaderTextTemplate3 = ({ Data }: { Data: PageData2[] }) => {
  return (
    <div className="flex flex-col w-full items-center">
      {Data.map((data) => {
        return (
          <div className="flex flex-col gap-7 lg:px-0 py-10 lg:pt-11 lg:w-full max-w-4xl w-fit m-auto lg:text-start text-center">
            <SubtitleTemplate3 Subtitle={data.header} />
            <SubHeaderTextTemplate Data={data.subheaders} />
          </div>
        );
      })}
    </div>
  );
};

export default HeaderTextTemplate3;
