import React from "react";
import SubtitleTemplate3 from "./SubtitleTemplate3";
import HeaderTextTemplate2 from "./HeaderTextTemplate2";
import HeaderTextTemplate3 from "./HeaderTextTemplate3";
import { PageData } from "./HeaderTextTemplate";

interface timeline {
  number: number;
  header: string;
  points: PageData[];
}

const TimelineTemplate = ({ Data }: { Data: timeline[] }) => {
  return (
    <div className="relative mb-16 text-start grid md:gap-14 gap-0 md:grid-cols-2 grid-cols-1 lg:w-full max-w-4xl w-fit m-auto items-stretch">
      <div className="md:absolute none top-0 left-1/2 w-px h-full bg-dsmlcDataOrange transform -translate-x-1/2"></div>
      {Data.map((data) => {
        return (
          <div className="flex flex-col md:gap-5 px-5 lg:pl-5 md:pt-5 pt-11 lg:w-full max-w-4xl w-fit m-auto h-full md:text-center text-start">
            <div className="md:text-2xl text-lg text-dsmlcBlack font-bold flex items-center justify-center">
              {data.number}
            </div>
            <SubtitleTemplate3 Subtitle={data.header} />
            <HeaderTextTemplate3 Data={data.points} />
          </div>
        );
      })}
    </div>
  );
};

export default TimelineTemplate;
