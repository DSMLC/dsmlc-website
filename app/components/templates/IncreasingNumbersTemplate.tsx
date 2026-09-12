"use client";
import { IncreasingNumbersData } from "@/app/DataLoader";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";

const IncreasingNumbersTemplate = ({
  Data,
}: {
  Data: IncreasingNumbersData["data"];
}) => {
  const [isVisible, setIsVisible] = useState<boolean[]>([]);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const itemCount = Data.length;

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
          { threshold: 0.1 },
        );
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [Data]);

  // Determine how many columns to use per row (max 4)
  const cols = Math.min(itemCount, 4);

  const getGridClass = () => {
    switch (cols) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-3";
      case 4:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    }
  };

  const remainder = itemCount > 4 ? itemCount % cols : 0;
  const fullRowItems =
    remainder !== 0 ? Data.slice(0, itemCount - remainder) : Data;
  const lastRowItems = remainder !== 0 ? Data.slice(itemCount - remainder) : [];

  const renderCard = (
    stat: IncreasingNumbersData["data"][number],
    index: number,
  ) => (
    <motion.div
      key={index}
      className="flex flex-col justify-between group transition-shadow hover:shadow-2xl bg-light-dsmlcParchment dark:bg-dark-dsmlcParchment shadow-lg rounded-3xl p-6 text-center w-full max-w-sm"
      style={{ transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.07, rotateX: 8, rotateY: 8 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
    >
      <div
        ref={(el) => {
          containerRefs.current[index] = el;
        }}
      >
        <h2 className="lg:text-5xl sm:text-4xl text-5xl font-extrabold text-dsmlcTangerine group-hover:text-dsmlcDataOrange">
          {isVisible[index] ? (
            <>
              <CountUp start={0} end={stat.value || 0} duration={4} />
              {stat.unit}
            </>
          ) : (
            `0${stat.unit ?? ""}`
          )}
        </h2>
        <p className="lg:text-xl sm:text-base text-2xl dark:text-dark-dsmlcBlack text-light-dsmlcBlack mt-2">
          {stat.title}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto py-10">
      <div
        className={`grid ${getGridClass()} gap-6 justify-items-center items-center`}
      >
        {fullRowItems.map((stat, index) => renderCard(stat, index))}
      </div>

      {lastRowItems.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-6">
          {lastRowItems.map((stat, index) => (
            <div key={index} className="w-full sm:max-w-[calc(25%-0.75rem)]">
              {renderCard(stat, fullRowItems.length + index)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncreasingNumbersTemplate;
