"use client";
import { InfoBubbleTemplateData } from "@/app/DataLoader";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const InfoBubbleTemplate = ({
  Data,
}: {
  Data: InfoBubbleTemplateData["data"];
}) => {
  return (
    <div className="pb-5 pt-5 grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 w-full max-w-4xl m-auto lg:px-0 px-10">
      {Data.map((section, index) => {
        return (
          <motion.div
            key={index}
            className="
                      flex items-center justify-between group
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
            <div className="flex-shrink-0">
              {section.image && (
                <Image
                  src={section.image.imageLink || ""}
                  alt={`${section.image.imageName || ""} Logo`}
                  width={25}
                  height={25}
                />
              )}
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium dark:text-dark-dsmlcBlack text-light-dsmlcBlack truncate font-redHat">
                  {section.title}
                </dt>
                <dd>
                  <div className="text-lg font-medium text-dsmlcTangerine font-quicksand">
                    {section.text}
                  </div>
                </dd>
              </dl>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default InfoBubbleTemplate;
