import React from "react";

const TitleTemplate = ({
  Title,
  Subtitle,
}: {
  Title: string;
  Subtitle?: string;
}) => {
  return (
    <div className="flex flex-col border-b-2 border-dsmlcBlack border-opacity-25 pt-20 lg:w-full max-w-4xl w-fit m-auto pb-5 gap-3">
      <h1 className="font-redHat font-[750] md:text-5xl text-4xl lg:text-start text-center text-dsmlcTangerine">
        {Title}
      </h1>
      <h2 className="md:text-lg text-sm md:px-0 px-10 md:text-start text-center">
        {Subtitle}
      </h2>
    </div>
  );
};

export default TitleTemplate;
