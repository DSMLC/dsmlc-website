"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { BackgroundFillTemplateData } from "@/app/DataLoader";

const BackgroundFillTemplate = ({
  Data,
  templateMap,
}: {
  Data: BackgroundFillTemplateData["data"];
  templateMap?: { [key: string]: React.ComponentType<{ Data: any }> };
}) => {
  const ref = useRef(null); // Create a ref for the element

  const hasHeaderTextTemplate = Data.some(
    (item) => item.type === "HeaderTextTemplate1"
  );

  // Animation variants
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
      viewport={{ once: true, amount: 0.2 }} // Trigger animation based on scroll
      variants={containerVariants}
      className={`bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite border dark:border-dark-dsmlcEnhancedParchment border-light-dsmlcEnhancedParchment shadow-lg dark:shadow-dark-dsmlcParchment shadow-light-dsmlcParchment rounded-4xl ${
        hasHeaderTextTemplate
          ? "py-8 sm:py-12"
          : "max-w-4xl w-fit m-auto p-8 sm:p-12"
      } mb-16 lg:min-w-[900px]`}
    >
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
    </motion.div>
  );
};

export default BackgroundFillTemplate;
