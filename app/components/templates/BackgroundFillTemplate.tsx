import { templateMap } from "@/app/DataLoader";
import React from "react";

const BackgroundFillTemplate = ({ Data }: { Data: any[] }) => {
  return (
    <div className="bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite shadow-xl rounded-4xl max-w-4xl w-fit m-auto mb-16 p-8 sm:p-12 lg:min-w-[900px]">
      {Data.map((item, index) => {
        const { type, data } = item;
        const TemplateComponent = templateMap[type as keyof typeof templateMap];

        if (!TemplateComponent) {
          return <div key={index}>Unsupported data type: {type}</div>;
        }

        return <TemplateComponent key={index} Data={data} />;
      })}
    </div>
  );
};

export default BackgroundFillTemplate;
