"use client";
import { HeaderTextTemplateData1 } from "@/app/DataLoader";
import React, { useRef } from "react";
import { motion } from "framer-motion";

const HeaderTextTemplate = ({
  Data,
}: {
  Data: HeaderTextTemplateData1["data"];
}) => {
  const ref = useRef(null);

  return (
    <div className="relative w-full overflow-x-hidden" ref={ref}>
      {Data.map((data, index) => {
        const isEven = index % 2 === 0;

        const slideInVariants = {
          hidden: { opacity: 0, x: isEven ? -100 : 100 }, // Start from left or right
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: "easeOut" },
          },
        };

        return (
          <motion.div
            key={index}
            className="mb-14 relative"
            initial="hidden"
            whileInView="visible" 
            viewport={{ once: true, amount: 0.8 }} // Animate when 80% of the element is visible
            variants={slideInVariants}
          >
            <div
              className={`absolute top-0 ${
                isEven
                  ? "lg:left-0 lg:rounded-r-full"
                  : "lg:right-0 lg:rounded-l-full"
              } xl:w-5/6 lg:w-11/12 w-full h-full dark:bg-dark-dsmlcParchment bg-light-dsmlcParchment`}
            ></div>
            <div className="relative z-10 flex flex-col items-center px-4 py-16 lg:py-20">
              <div className="text-start lg:text-3xl md:text-2xl text-xl font-bold font-redHat text-dsmlcDataOrange mb-7">
                {data.header}
              </div>
              <div
                className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack tracking-wide max-w-3xl font-quicksand lg:text-lg md:text-base text-sm text-start"
                dangerouslySetInnerHTML={{ __html: data.text }}
              ></div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default HeaderTextTemplate;
