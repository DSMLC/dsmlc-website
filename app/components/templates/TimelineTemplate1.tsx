"use client";

import React, { useEffect, useRef } from "react";
import SubtitleTemplate3 from "./SubtitleTemplate3";
import SubHeaderTextTemplate from "./SubHeaderTextTemplate";
import { TimelineTemplateData1 } from "@/app/DataLoader";
import ImageTemplate, { ImageType } from "./ImageTemplate";

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
      observer.disconnect(); 
    };
  }, []);

  return (
    <div className="relative mb-16 text-start grid md:gap-14 gap-7 md:grid-cols-2 grid-cols-1 lg:w-full max-w-4xl w-fit m-auto items-stretch">
      <div className="absolute top-0 md:left-1/2 left-6 w-px h-full dark:bg-dark-dsmlcBlack bg-light-dsmlcBlack transform -translate-x-1/2"></div>
      {Data.map((data, index) => {
        const getFontSize = () => {
          const length = String(data.number).length;
          if (length <= 2) return "text-2xl"; // Standard size for 1-2 characters
          if (length === 3) return "text-md"; // Smaller size for 3 characters
          return "text-sm"; // Smallest size for 4 or more characters
        };

        return (
          <React.Fragment key={index}>
            {index % 2 === 0 ? (
              <div className="flex justify-center items-center">
                {data.image && (
                  <ImageTemplate
                    image={data.image.imageLink || ""}
                    name={data.image.imageName || ""}
                    type={data.image.imageType as ImageType}
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
                    type={data.image.imageType as ImageType}
                  />
                )}
              </div>
            ) : null}

            <div className="flex flex-col gap-7 lg:px-0 px-5 lg:w-full max-w-4xl w-fit m-auto h-full">
              <div
                className={`absolute md:left-1/2 left-6 transform -translate-x-1/2 dark:bg-dark-dsmlcParchment bg-light-dsmlcParchment text-center ${getFontSize()} text-dsmlcDataOrange font-bold w-12 h-12 flex items-center justify-center rounded-full border-2 dark:border-dark-dsmlcBlack border-light-dsmlcBlack border-solid`}
              >
                {" "}
                {data.number}
              </div>

              <div
                ref={(el) => {
                  timelineRefs.current[index] = el;
                }}
                className={`flex flex-col gap-7 lg:px-0 px-5 lg:w-full max-w-4xl w-fit m-auto h-full transform transition-all duration-1000 ease-in-out opacity-0 ${
                  index % 2 === 0
                    ? "sm:translate-x-full md:pl-10 lg:pl-5 pl-10"
                    : "sm:-translate-x-full md:pr-10 lg:pr-5 pl-10"
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
                    type={data.image.imageType as ImageType}
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
