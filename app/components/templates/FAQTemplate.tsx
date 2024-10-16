"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import SubtitleTemplate2 from "./SubtitleTemplate2";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQData {
  header: string;
  faq: FAQItem[];
}

const FAQTemplate = ({ Data }: { Data: FAQData }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!Data.faq || Data.faq.length === 0) {
    return (
      <div className="text-center text-dsmlcBlack">No FAQ items available.</div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-16 lg:px-0 px-10">
      <SubtitleTemplate2 Subtitle={Data.header} />
      {Data.faq.map((item, index) => (
        <div key={index} className="border-b-2 border-dsmlcTangerine py-4">
          <button
            className="flex justify-between items-center w-full text-left"
            onClick={() => toggleItem(index)}
          >
            <span className="font-redHat font-semibold lg:text-lg text-base text-dsmlcBlack">
              {item.question}
            </span>
            {openIndex === index ? (
              <ChevronUp className="text-dsmlcTangerine" />
            ) : (
              <ChevronDown className="text-dsmlcTangerine" />
            )}
          </button>
          {openIndex === index && (
            <div className="mt-2 text-dsmlcBlack lg:text-lg text-base">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQTemplate;
