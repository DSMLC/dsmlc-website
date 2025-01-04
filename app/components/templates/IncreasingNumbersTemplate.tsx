"use client";
import { IncreasingNumbersData } from "@/app/DataLoader";
import React, { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";

const IncreasingNumbersTemplate = ({
  Data,
}: {
  Data: IncreasingNumbersData["data"];
}) => {
  const [isVisible, setIsVisible] = useState<boolean[]>([]);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    containerRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsVisible((prev) => {
                const updated = [...prev];
                updated[index] = true;
                return updated;
              });
              observer.disconnect();
            }
          },
          { threshold: 0.1 } 
        );
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [Data]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center items-center max-w-4xl m-auto py-10">
      {Data.map((stat, index) => (
        <div
          key={index}
          className="bg-light-dsmlcParchment dark:bg-dark-dsmlcParchment shadow-lg rounded-3xl p-6 text-center w-full max-w-sm"
          ref={(el) => {
            containerRefs.current[index] = el;
          }} // Attach refs dynamically
        >
          <h2 className="text-5xl font-extrabold text-dsmlcTangerine">
            {isVisible[index] ? (
              <CountUp start={0} end={stat.value || 0} duration={4} />
            ) : (
              "0"
            )}
          </h2>
          <p className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack mt-2">
            {stat.title}
          </p>
        </div>
      ))}
    </div>
  );
};

export default IncreasingNumbersTemplate;
