import { InfoBubbleTemplateData } from "@/app/DataLoader";
import React from "react";
import Image from "next/image";

const InfoBubbleTemplate = ({
  Data,
}: {
  Data: InfoBubbleTemplateData["data"];
}) => {
  return (
    <div className="pb-16 grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 w-full max-w-4xl m-auto lg:px-0 px-10">
      {Data.map((section) => {
        return (
          <div className="bg-dsmlcWhite shadow-lg rounded-3xl p-6 flex items-center">
            <div className="flex-shrink-0">
              <Image
                src={section.imageLink}
                alt={`${section.imageLink} Logo`}
                width={25}
                height={25}
              />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-dsmlcBlack truncate font-redHat">
                  {section.title}
                </dt>
                <dd>
                  <div className="text-lg font-medium text-dsmlcDataOrange font-quicksand">
                    {section.text}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InfoBubbleTemplate;
