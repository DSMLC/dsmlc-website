"use client";
import { ComingSoonTemplateData } from "@/app/DataLoader";
import React from "react";
import SocialLinksTemplate from "./SocialLinksTemplate";

const TitleTemplate2 = ({ Data }: { Data: ComingSoonTemplateData["data"] }) => {
  return (
    <>
    <div className="border-2 border-dashed border-dsmlcTangerine rounded-md p-3">
      <h1 className="lg:text-3xl md:text-2xl text-xl font-extrabold text-center text-dsmlcTangerine mb-5 font-redHat leading-tight pt-3 pb-3">
        Check Back for Future Events!
      </h1>
      <p className="lg:text-lg md:text-md text-base text-center dark:text-dark-dsmlcBlack text-light-dsmlcBlack mb-2 font-quicksand">
        Keep up with our socials for updates!
      </p>
      <SocialLinksTemplate Data={{}}></SocialLinksTemplate>


    </div>  
      
    </>
  );
};

export default TitleTemplate2;