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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-items-center items-center max-w-4xl m-auto py-10">
      {Data.map((stat, index) => (
        <motion.div
          key={index}
          className="
                      flex flex-col justify-between group
                      transition-shadow hover:shadow-2xl bg-light-dsmlcParchment dark:bg-dark-dsmlcParchment shadow-lg rounded-3xl p-6 text-center w-full max-w-sm
                    "
          style={{ transformStyle: "preserve-3d" }}
          whileHover={{
            scale: 1.07,
            rotateX: 8,
            rotateY: 8,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <div
            key={index}
            ref={(el) => {
              containerRefs.current[index] = el;
            }} // Attach refs dynamically
          >
            <h2 className="lg:text-5xl sm:text-4xl text-5xl font-extrabold text-dsmlcTangerine group-hover:text-dsmlcDataOrange">
              {isVisible[index] ? (
                <>
                  <CountUp start={0} end={stat.value || 0} duration={4} />
                  {stat.unit}
                </>
              ) : (
                `0${stat.unit}`
              )}
            </h2>
            <p className="lg:text-xl sm:text-base text-2xl dark:text-dark-dsmlcBlack text-light-dsmlcBlack mt-2">
              {stat.title}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default IncreasingNumbersTemplate;
