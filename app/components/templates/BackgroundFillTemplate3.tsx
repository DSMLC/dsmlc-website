"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BackgroundFillTemplateData2 } from "@/app/DataLoader";

const BackgroundFillTemplate2 = ({
  Data,
  templateMap,
}: {
  Data: BackgroundFillTemplateData2["data"];
  templateMap?: { [key: string]: React.ComponentType<{ Data: any }> };
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["30%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6]);

  const hasHeaderTextTemplate = Data.some(
    (item) => item.type === "HeaderTextTemplate1"
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2, // Stagger children animation
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px 0px -100px 0px" }}
      variants={containerVariants}
      className={`relative overflow-hidden justify-center items-center bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite border border-dsmlcTangerine rounded-2xl sm:rounded-4xl ${
        hasHeaderTextTemplate
          ? "py-4 sm:py-8 md:py-12"
          : "max-w-none sm:max-w-6xl lg:max-w-7xl xl:max-w-none w-full sm:w-fit m-auto p-2 sm:p-4 md:p-8 lg:p-12"
      } mb-4 sm:mb-8 md:mb-16`}
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${
            hasHeaderTextTemplate ? "#FF914D" : "#F86306"
          } 10%, transparent 10%)`,
          backgroundSize: "20px 20px",
          opacity,
          y: backgroundY,
        }}
      />
      <div className="relative z-10">
        {Data.map((item, index) => {
          const { type, data } = item;
          const TemplateComponent =
            templateMap && templateMap[type as keyof typeof templateMap];

          if (!TemplateComponent) {
            return <div key={index}>Unsupported data type: {type}</div>;
          }

          return (
            <motion.div key={index} variants={childVariants}>
              <TemplateComponent Data={data} />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BackgroundFillTemplate2;
