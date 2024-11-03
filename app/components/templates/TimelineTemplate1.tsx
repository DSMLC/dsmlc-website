"use client";

import React, { useEffect, useRef } from "react";
import SubtitleTemplate3 from "./SubtitleTemplate3";
import SubHeaderTextTemplate from "./SubHeaderTextTemplate";
import { TimelineTemplateData1 } from "@/app/DataLoader";
import ImageTemplate from "./ImageTemplate";

const TimelineTemplate1 = ({
  Data,
}: {
  Data: TimelineTemplateData1["data"];
}) => {
  const timelineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove(
              "sm:translate-x-full",
              "sm:-translate-x-full",
              "opacity-0"
            );
            entry.target.classList.add("translate-x-0", "opacity-100");
          }
        });
      },
      {
        threshold: 0.7,
        rootMargin: "-50px 500px -50px 500px",
      }
    );

    timelineRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      timelineRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div className="relative mb-16 text-start grid gap-14 md:grid-cols-2 grid-cols-1 lg:w-full max-w-4xl w-fit m-auto items-stretch">
      <div className="absolute top-0 md:left-1/2 left-4 w-px h-full bg-dsmlcBlack transform -translate-x-1/2"></div>
      {Data.map((data, index) => {
        return (
          <React.Fragment key={index}>
            {index % 2 === 0 ? (
              <div className="flex justify-center items-center">
                {data.image && (
                  <ImageTemplate
                    image={data.image.imageLink || ""}
                    name={data.image.imageName || ""}
                    type={data.image.imageType || ""}
                  />
                )}
              </div>
            ) : null}

            {index % 2 !== 0 ? (
              <div className="flex justify-center items-center md:hidden">
                {data.image && (
                  <ImageTemplate
                    image={data.image.imageLink || ""}
                    name={data.image.imageName || ""}
                    type={data.image.imageType || ""}
                  />
                )}
              </div>
            ) : null}

            <div className="flex flex-col gap-7 lg:px-0 px-5 pl-10 lg:pl-5 lg:w-full max-w-4xl w-fit m-auto h-full">
              <div className="absolute md:left-1/2 left-4 transform -translate-x-1/2 bg-dsmlcParchment text-center md:text-2xl text-lg text-dsmlcDataOrange font-bold md:w-12 md:h-12 w-7 h-7 flex items-center justify-center rounded-full border-2 border-dsmlcBlack border-solid">
                {data.number}
              </div>

              <div
                ref={(el) => {
                  timelineRefs.current[index] = el;
                }}
                className={`flex flex-col gap-7 lg:px-0 px-5 pl-10 lg:pl-5 lg:w-full max-w-4xl w-fit m-auto h-full transform transition-all duration-1000 ease-in-out opacity-0 ${
                  index % 2 === 0
                    ? "sm:translate-x-full"
                    : "sm:-translate-x-full"
                }`}
              >
                <SubtitleTemplate3 Data={data.header} />
                <SubHeaderTextTemplate Data={data.points} />
              </div>
            </div>

            {index % 2 !== 0 ? (
              <div className="md:flex hidden justify-center items-center">
                {data.image && (
                  <ImageTemplate
                    image={data.image.imageLink || ""}
                    name={data.image.imageName || ""}
                    type={data.image.imageType || ""}
                  />
                )}
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default TimelineTemplate1;
