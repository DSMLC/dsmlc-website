import { ApplicationTemplateData } from "@/app/DataLoader";
import React from "react";

const ApplicationSection = ({
  Data,
}: {
  Data: ApplicationTemplateData["data"];
}) => {
  return (
    <>
      <h2 className="text-3xl font-bold text-dsmlcDataOrange mb-6 font-quicksand">
        {Data.title}
      </h2>
      <p className="text-lg text-dsmlcBlack mb-8">{Data.mainDescription}</p>
      <p className="text-lg text-dsmlcBlack mb-8">
        {Data.secondaryDescription}
      </p>
      <div className="space-y-4 mb-8">
        <h3 className="text-2xl font-semibold text-dsmlcTangerine font-quicksand">
          {Data.positionsSectionTitle}
        </h3>
        <ul className="list-disc list-inside text-dsmlcBlack space-y-2 pl-4">
          {Data.positions.map((position, index) => (
            <li key={index}>
              {position.count && `${position.count} `}
              {position.title}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ApplicationSection;
