"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ImageTemplate from "./ImageTemplate";
import { CarouselTemplateData } from "@/app/DataLoader";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CarouselTemplate = ({ Data }: { Data: CarouselTemplateData["data"] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer(); // Make sure we don't stack multiple intervals
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === Data.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
  }, [Data.length, 5000, clearTimer]);

  useEffect(() => {
    startTimer();
    return () => {
      clearTimer();
    };
  }, [startTimer, clearTimer]);

  const goToNext = () => {
    setCurrentIndex((current) =>
      current === Data.length - 1 ? 0 : current + 1
    );
    startTimer();
  };

  const goToPrevious = () => {
    setCurrentIndex((current) =>
      current === 0 ? Data.length - 1 : current - 1
    );
    startTimer();
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
    startTimer();
  };

  return (
    <div className="w-full flex flex-col justify-center items-center px-4 mb-10">
      <div className="relative group w-full max-w-4xl">
        <div className="flex justify-between gap-5 items-center">
          <button
            className="h-fit text-dsmlcTangerine p-2 rounded-full opacity-50 hover:scale-110 group-hover:opacity-100 transition-all duration-300 hover:text-dsmlcDataOrange border-2 hover:border-dsmlcDataOrange border-dsmlcTangerine"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          {Data[currentIndex].image && (
            <ImageTemplate
              image={Data[currentIndex].image.imageLink || ""}
              name={Data[currentIndex].image.imageName || ""}
              type={"Banner"}
            />
          )}
          <button
            className="h-fit text-dsmlcTangerine transition-all p-2 rounded-full opacity-50 hover:scale-110 group-hover:opacity-100 duration-300 hover:text-dsmlcDataOrange border-2 hover:border-dsmlcDataOrange border-dsmlcTangerine"
            onClick={goToNext}
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {Data.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-dsmlcDataOrange scale-125"
                    : "bg-dsmlcTangerine opacity-50 scale-75"
                }`}
                onClick={() => goToImage(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="dark:text-dark-dsmlcBlack text-xl text-light-dsmlcBlack pt-5 flex flex-col gap-5 text-center">
        {Data[currentIndex].header}
        {Data[currentIndex].points?.map((point, index) => (
          <span key={index} className="text-base min-h-20">
            <span className="font-bold">{point.header}</span>
            {point.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CarouselTemplate;
