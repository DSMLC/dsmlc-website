"use client";
import {
  ComingSoonTemplateData,
  PageData,
  resolveData,
} from "@/app/DataLoader";
import React, { useEffect, useState } from "react";
import SocialLinksTemplate from "./SocialLinksTemplate";

const ComingSoonTemplate = ({
  Data,
}: {
  Data: ComingSoonTemplateData["data"];
}) => {
  const [resolvedConditionData, setResolvedConditionData] = useState<
    any | null
  >(null);

  useEffect(() => {
    (async () => {
      const data = await resolveData(Data.condition as PageData);
      setResolvedConditionData(data);
    })();
  }, [Data.condition]);

  if (Data.condition.type === "array") {
    if (resolvedConditionData != null && resolvedConditionData.length > 0) {
      return;
    }
  }

  return (
    <>
      <div className="border-2 border-dashed border-dsmlcTangerine rounded-md p-3">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-extrabold text-center text-dsmlcTangerine mb-5 font-redHat leading-tight pt-3 pb-3">
          {Data.header}
        </h1>
        <p className="lg:text-lg md:text-md text-base text-center dark:text-dark-dsmlcBlack text-light-dsmlcBlack mb-2 font-quicksand">
          {Data.subtext}
        </p>
        <SocialLinksTemplate Data={{}}></SocialLinksTemplate>
      </div>
    </>
  );
};

export default ComingSoonTemplate;
