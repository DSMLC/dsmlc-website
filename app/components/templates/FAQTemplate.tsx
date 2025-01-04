"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import SubtitleTemplate2 from "./SubtitleTemplate2";
import { FAQTemplateData } from "@/app/DataLoader";


const FAQTemplate = ({ Data }: { Data: FAQTemplateData['data'] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!Data.faq || Data.faq.length === 0) {
    return (
      <div className="text-center dark:text-dark-dsmlcBlack text-light-dsmlcBlack">No FAQ items available.</div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-16 lg:px-0 px-10">
      <SubtitleTemplate2 Data={Data.header} />
      {Data.faq.map((item, index) => (
        <div key={index} className="border-b-2 border-dsmlcTangerine py-4">
          <button
            className="flex justify-between items-center w-full text-left"
            onClick={() => toggleItem(index)}
          >
            <span className="font-redHat font-semibold lg:text-lg text-base dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
              {item.question}
            </span>
            {openIndex === index ? (
              <ChevronUp className="text-dsmlcTangerine" />
            ) : (
              <ChevronDown className="text-dsmlcTangerine" />
            )}
          </button>
          {openIndex === index && (
            <div className="mt-2 dark:text-dark-dsmlcBlack text-light-dsmlcBlack lg:text-lg text-base">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQTemplate;
