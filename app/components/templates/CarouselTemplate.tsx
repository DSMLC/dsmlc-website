"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ImageTemplate, { ImageType } from "./ImageTemplate";
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
        prevIndex === Data.image.length - 1 ? 0 : prevIndex + 1
      );
    }, Data.interval);
  }, [Data.image.length, Data.interval, clearTimer]);

  useEffect(() => {
    startTimer();
    return () => {
      clearTimer();
    };
  }, [startTimer, clearTimer]);

  const goToNext = () => {
    setCurrentIndex((current) =>
      current === Data.image.length - 1 ? 0 : current + 1
    );
    startTimer();
  };

  const goToPrevious = () => {
    setCurrentIndex((current) =>
      current === 0 ? Data.image.length - 1 : current - 1
    );
    startTimer();
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
    startTimer();
  };

  return (
    <div className="w-full flex justify-center items-center px-4 mb-16">
      <div className="relative group w-full max-w-4xl">
        <div className="flex justify-between gap-5 items-center">
          <button
            className="h-fit text-dsmlcDataOrange p-2 rounded-full opacity-50 group-hover:bg-dsmlcTangerine group-hover:opacity-100 transition-opacity duration-300 dark:hover:text-dark-dsmlcParchment hover:text-light-dsmlcParchment border-2 dark:hover:border-dark-dsmlcParchment hover:border-light-dsmlcParchment border-dsmlcDataOrange"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <ImageTemplate
            image={Data.image[currentIndex].imageLink || ""}
            name={Data.image[currentIndex].imageName || ""}
            type={Data.image[currentIndex].imageType as ImageType}
          />
          <button
            className="h-fit text-dsmlcDataOrange p-2 rounded-full opacity-50 group-hover:bg-dsmlcTangerine group-hover:opacity-100 transition-opacity duration-300 dark:hover:text-dark-dsmlcParchment hover:text-light-dsmlcParchment border-2 dark:hover:border-dark-dsmlcParchment hover:border-light-dsmlcParchment border-dsmlcDataOrange"
            onClick={goToNext}
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {Data.image.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-dsmlcTangerine scale-125"
                    : "bg-dsmlcTangerine/50"
                }`}
                onClick={() => goToImage(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselTemplate;
