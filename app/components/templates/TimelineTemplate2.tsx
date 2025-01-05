"use client";
import React from "react";
import { motion, useInView } from "framer-motion";
import SubtitleTemplate3 from "./SubtitleTemplate3";
import HeaderTextTemplate3 from "./HeaderTextTemplate3";
import { TimelineTemplateData2 } from "@/app/DataLoader";

const TimelineSection = ({ data, index }: { data: any; index: number }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-250px",
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 1,
        delay: 0, // Stagger effect based on index
        ease: "easeOut",
      }}
      className="flex flex-col md:gap-5 lg:px-0 px-5 lg:pl-5 md:pt-5 pt-11 lg:w-full max-w-4xl w-fit m-auto h-full text-start"
    >
      <div className="md:text-2xl text-lg dark:text-dark-dsmlcBlack text-light-dsmlcBlack font-bold flex items-center justify-center">
        {data.number}
      </div>
      <SubtitleTemplate3 Data={data.header} />
      <HeaderTextTemplate3 Data={data.points} />
    </motion.div>
  );
};

const TimelineTemplate = ({
  Data,
}: {
  Data: TimelineTemplateData2["data"];
}) => {
  return (
    <div className="relative mb-16 text-start grid md:gap-14 gap-0 md:grid-cols-2 grid-cols-1 lg:w-full max-w-4xl w-fit m-auto items-stretch">
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="md:absolute none top-0 left-1/2 w-px h-full bg-dsmlcDataOrange transform -translate-x-1/2"
      />
      {Data.map((data, index) => (
        <TimelineSection key={index} data={data} index={index} />
      ))}
    </div>
  );
};

export default TimelineTemplate;
