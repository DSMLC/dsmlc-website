import React from "react";

interface Position {
  title: string;
  count?: string;
}

interface ApplicationSectionProps {
  title: string;
  mainDescription: string;
  secondaryDescription: string;
  positionsSectionTitle: string;
  positions: Position[];
}

const ApplicationSection = ({
  title,
  mainDescription,
  secondaryDescription,
  positionsSectionTitle,
  positions,
}: ApplicationSectionProps) => {
  return (
    <>
      <h2 className="text-3xl font-bold text-dsmlcDataOrange mb-6 font-quicksand">
        {title}
      </h2>
      <p className="text-lg text-dsmlcBlack mb-8">{mainDescription}</p>
      <p className="text-lg text-dsmlcBlack mb-8">{secondaryDescription}</p>
      <div className="space-y-4 mb-8">
        <h3 className="text-2xl font-semibold text-dsmlcTangerine font-quicksand">
          {positionsSectionTitle}
        </h3>
        <ul className="list-disc list-inside text-dsmlcBlack space-y-2 pl-4">
          {positions.map((position, index) => (
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
