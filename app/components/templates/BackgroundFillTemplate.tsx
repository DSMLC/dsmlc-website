import { templateMap } from "@/app/DataLoader";
import React from "react";

const BackgroundFillTemplate = ({ Data }: { Data: any[] }) => {
  const hasHeaderTextTemplate = Data.some(
    (item) => item.type === "HeaderTextTemplate1"
  );

  return (
    <div
      className={`bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite border dark:border-dark-dsmlcEnhancedParchment border-light-dsmlcEnhancedParchment shadow-lg dark:shadow-dark-dsmlcParchment shadow-light-dsmlcParchment rounded-4xl ${
        hasHeaderTextTemplate
          ? "py-8 sm:py-12"
          : "max-w-4xl w-fit m-auto p-8 sm:p-12"
      } mb-16 lg:min-w-[900px]`}
    >
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
