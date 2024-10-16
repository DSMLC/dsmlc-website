"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQAccordion = ({ Data }: {Data : FAQItem[]}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!Data || Data.length === 0) {
    return (
      <div className="text-center text-gray-500">No FAQ items available.</div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-4xl font-redHat font-bold text-dsmlcTangerine text-center mb-8 border-b-2 border-dsmlcTangerine pb-4">
        Frequently Asked Questions
      </h1>
      {Data.map((item, index) => (
        <div key={index} className="border-b border-gray-200 py-4">
          <button
            className="flex justify-between items-center w-full text-left"
            onClick={() => toggleItem(index)}
          >
            <span className="font-redHat font-semibold text-lg text-dsmlcTangerine">
              {item.question}
            </span>
            {openIndex === index ? (
              <ChevronUp className="text-dsmlcTangerine" />
            ) : (
              <ChevronDown className="text-dsmlcTangerine" />
            )}
          </button>
          {openIndex === index && (
            <div className="mt-2 text-gray-600">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;
