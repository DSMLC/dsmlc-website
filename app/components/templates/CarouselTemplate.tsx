"use client";

import React, { useState, useEffect } from "react";
import ImageTemplate from "./ImageTemplate";
import { CarouselTemplateData } from "@/app/DataLoader";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CarouselTemplate = ({ Data }: { Data: CarouselTemplateData["data"] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((current) =>
        current === Data.image.length - 1 ? 0 : current + 1
      );
    }, Data.interval);

    return () => clearInterval(timer);
  }, [Data.image.length, Data.interval]);

  const goToNext = () => {
    setCurrentIndex((current) =>
      current === Data.image.length - 1 ? 0 : current + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((current) =>
      current === 0 ? Data.image.length - 1 : current - 1
    );
  };

  return (
    <div className="w-full flex justify-center items-center px-4 mb-16">
      <div className="relative group w-full max-w-6xl aspect-[16/7] rounded-5xl">
        <div className="relative w-full h-full flex justify-center items-center">
          <ImageTemplate
            image={Data.image[currentIndex].imageLink || ""}
            name={Data.image[currentIndex].imageName || ""}
            type={Data.image[currentIndex].imageType || ""}
          />
        </div>

        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-Tangerine/80 text-dsmlcDataOrange p-2 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300 hover:bg-dsmlcTangerine hover:text-dsmlcParchment"
          onClick={goToPrevious}
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-Tangerine/80 text-dsmlcDataOrange p-2 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300 hover:bg-dsmlcTangerine hover:text-dsmlcParchment"
          onClick={goToNext}
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Navigation - Made larger */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
          {Data.image.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-dsmlcTangerine scale-125"
                  : "bg-dsmlcTangerine/50"
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselTemplate;
