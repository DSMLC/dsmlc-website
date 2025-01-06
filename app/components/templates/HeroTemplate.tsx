"use client";
import React from "react";
import ImageTemplate, { ImageType } from "./ImageTemplate";
import { HeroTemplateData } from "@/app/DataLoader";
import { useTheme } from "../../ThemeProvider";
import ParticleBackground from "../ParticleBackground";
import AILottieAnimation from "../AILottieAnimation";
import SocialLinksTemplate from "./SocialLinksTemplate";

const HeroTemplate = ({ Data }: { Data: HeroTemplateData["data"] }) => {
  const { isDarkMode } = useTheme();
  const heroData = Data[0];
  return (
    <div className="w-full h-[85vh] flex-col relative">
      <ParticleBackground />
      <div className="flex justify-center items-center h-full gap-10 flex-col dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
        <div className="bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite rounded-4xl p-8 font-redHat lg:text-4xl md:text-3xl text-2xl md:gap-10 gap-5 flex md:flex-row flex-col md:items-end items-center justify-center">
          <ImageTemplate
            image={
              isDarkMode
                ? heroData.logo?.light_logo || ""
                : heroData.logo?.dark_logo || ""
            }
            name={heroData.name}
            type={"Logo" as ImageType}
          />
          <div className="flex flex-col md:text-start text-center">
            {heroData.superscript_name && (
              <span
                dangerouslySetInnerHTML={{
                  __html: heroData.superscript_name,
                }}
                className="md:text-sm text-xs font-light"
              ></span>
            )}
            {heroData.name_styled && (
              <span
                dangerouslySetInnerHTML={{
                  __html: heroData.name_styled,
                }}
                className="uppercase lg:text-5xl md:text-4xl text-2xl"
              ></span>
            )}
          </div>
        </div>
        {heroData.description && (
          <div className="font-quicksand lg:text-xl md:text-lg text-base lg:w-1/3 sm:w-1/2 w-3/4 text-center">
            {heroData.description}
          </div>
        )}
        {/* <AILottieAnimation /> */}
        <SocialLinksTemplate />
      </div>
    </div>
  );
};

export default HeroTemplate;
