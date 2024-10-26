import React from "react";
import SubtitleTemplate3 from "./SubtitleTemplate3";
import HeaderTextTemplate2 from "./HeaderTextTemplate2";
import SubHeaderTextTemplate from "./SubHeaderTextTemplate";
import { PageData } from "./HeaderTextTemplate";

interface timeline {
  number: number;
  header: string;
  points: PageData[];
}

const TimelineTemplate = ({ Data }: { Data: timeline[] }) => {
  return (
    <div className="relative mb-16 text-start grid gap-14 md:grid-cols-2 grid-cols-1 lg:w-full max-w-4xl w-fit m-auto items-stretch">
      <div className="absolute top-0 md:left-1/2 left-4 w-px h-full bg-dsmlcBlack transform -translate-x-1/2"></div>
      {Data.map((data, index) => {
        return (
          <React.Fragment key={index}>
            {index % 2 === 0 ? <div className="hidden md:block"></div> : null}

            <div className="flex flex-col gap-7 px-5 pl-10 lg:pl-5 pt-11 lg:w-full max-w-4xl w-fit m-auto h-full">
              <div className="absolute md:left-1/2 left-4 transform -translate-x-1/2 bg-dsmlcParchment text-center md:text-2xl text-lg text-dsmlcDataOrange font-bold md:w-12 md:h-12 w-7 h-7 flex items-center justify-center rounded-full border-2 border-dsmlcBlack border-solid">
                {data.number}
              </div>
              <SubtitleTemplate3 Subtitle={data.header} />
              <SubHeaderTextTemplate Data={data.points} />
            </div>
            {index % 2 !== 0 ? <div className="hidden md:block"></div> : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default TimelineTemplate;
