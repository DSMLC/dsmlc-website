import React from "react";

const TitleTemplate = ({ Title }: { Title: string }) => {
  return (
    <div className="font-redHat font-[750] md:text-5xl text-4xl lg:text-start text-center text-dsmlcDataOrange border-b-2 border-dsmlcBlack border-opacity-25 pt-20 lg:w-full max-w-4xl w-fit m-auto pb-5">
      {Title}
    </div>
  );
};

export default TitleTemplate;
