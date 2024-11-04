"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const CarouselTemplate = ({
  images,
  interval = 5000,
  type = "Pic",
}: {
  images: Array<{ src: string; alt: string }>;
  interval?: number;
  type?: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((current) =>
        current === images.length - 1 ? 0 : current + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const goToNext = () => {
    setCurrentIndex((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  };

  // Updated class names for larger sizes and centering
  const imageClassname =
    type === "Pic"
      ? "object-cover object-center w-full h-full border-4 border-dsmlcTangerine rounded-4xl"
      : "";

  // Increased sizes for all screen breakpoints
  const largeSize = type === "Pic" ? 1200 : 200;
  const medSize = type === "Pic" ? 900 : 150;
  const smallSize = type === "Pic" ? 600 : 100;

  return (
    // Added container with centering classes
    <div className="w-full flex justify-center items-center px-4">
      <div className="relative group w-full max-w-6xl aspect-[16/9]">
        {/* Current Image Container */}
        <div className="relative w-full h-full flex justify-center items-center">
          <Image
            className={`${imageClassname} lg:block hidden transition-opacity duration-500`}
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            width={largeSize}
            height={Math.round(largeSize * 0.6)}
            priority
          />
          <Image
            className={`${imageClassname} lg:hidden md:block hidden transition-opacity duration-500`}
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            width={medSize}
            height={Math.round(medSize * 0.6)}
            priority
          />
          <Image
            className={`${imageClassname} md:hidden block transition-opacity duration-500`}
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            width={smallSize}
            height={Math.round(smallSize * 0.6)}
            priority
          />
        </div>

        {/* Navigation Buttons - Made larger */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-2xl"
          onClick={goToPrevious}
          aria-label="Previous image"
        >
          ←
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-2xl"
          onClick={goToNext}
          aria-label="Next image"
        >
          →
        </button>

        {/* Dots Navigation - Made larger */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? "bg-white scale-125" : "bg-white/50"
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
