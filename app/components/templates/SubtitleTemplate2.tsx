import React from "react";

const SubtitleTemplate2 = ({ Subtitle }: { Subtitle: string }) => {
  return (
    <div className="lg:text-3xl md:text-2xl text-xl font-redHat font-bold text-dsmlcTangerine text-center mb-8 border-b-2 border-dsmlcTangerine pb-4">
      {Subtitle}
    </div>
  );
};

export default SubtitleTemplate2;
