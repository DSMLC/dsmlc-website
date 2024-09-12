import React from "react";

const SubtitleTemplate = ({ Subtitle }: { Subtitle: string }) => {
  return (
    <div className="lg:text-3xl md:text-2xl text-xl font-bold font-redHat text-dsmlcTangerine uppercase">
      {Subtitle}
    </div>
  );
};

export default SubtitleTemplate;
