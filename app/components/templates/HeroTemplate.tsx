"use client";
import React from "react";
import Image from "next/image";
import SocialMediaData from "../../../public/data/club_links.json";
import ImageTemplate, { ImageType } from "./ImageTemplate";
import { HeroTemplateData } from "@/app/DataLoader";
import { useTheme } from "../../ThemeProvider";
import ParticleBackground from "../ParticleBackground";
import AILottieAnimation from "../AILottieAnimation";

const HeroTemplate = ({ Data }: { Data: HeroTemplateData["data"] }) => {
  const { isDarkMode } = useTheme();
  return (
    <div className="w-full h-[85vh] flex-col relative">
      <ParticleBackground />
      <div className="flex justify-center items-center h-full gap-10 flex-col dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
        <div className="bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite rounded-4xl p-8 font-redHat lg:text-4xl md:text-3xl text-2xl md:gap-10 gap-5 flex md:flex-row flex-col md:items-end items-center justify-center">
          <ImageTemplate
            image={
              isDarkMode
                ? Data.logo?.light_logo || ""
                : Data.logo?.dark_logo || ""
            }
            name={Data.name}
            type={"Logo" as ImageType}
          />
          <div className="flex flex-col md:text-start text-center">
            {Data.superscript_name && (
              <span
                dangerouslySetInnerHTML={{
                  __html: Data.superscript_name,
                }}
                className="md:text-sm text-xs font-light"
              ></span>
            )}
            {Data.name_styled && (
              <span
                dangerouslySetInnerHTML={{
                  __html: Data.name_styled,
                }}
                className="uppercase lg:text-5xl md:text-4xl text-2xl"
              ></span>
            )}
          </div>
        </div>
        {Data.description && (
          <div className="font-quicksand lg:text-xl md:text-lg text-base lg:w-1/3 sm:w-1/2 w-3/4 text-center">
            {Data.description}
          </div>
        )}
        {/* <AILottieAnimation /> */}
        <div className="flex-row flex gap-10 items-center">
          {Object.values(SocialMediaData.social_media).map((app, index) => {
            return (
              <div
                key={index}
                className="flex items-center dark:text-dark-dsmlcBlack text-light-dsmlcBlack hover:bg-dsmlcTangerine transition-all duration-300 rounded p-1 md:h-10 h-9"
              >
                {" "}
                <a href={app.link} target="_blank">
                  <Image
                    className="md:block hidden"
                    src={isDarkMode ? app.light_logo : app.dark_logo}
                    alt={`${app.name} Logo`}
                    width={30}
                    height={30}
                  />
                  <Image
                    className="md:hidden block"
                    src={isDarkMode ? app.light_logo : app.dark_logo}
                    alt={`${app.name} Logo`}
                    width={25}
                    height={25}
                  />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroTemplate;
