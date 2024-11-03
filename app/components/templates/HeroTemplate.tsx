import React from "react";
import Image from "next/image";
import SocialMediaData from "../../../public/data/club_links.json";
import ImageTemplate from "./ImageTemplate";
import { HeroTemplateData } from "@/app/DataLoader";

const HeroTemplate = ({ Data }: { Data: HeroTemplateData["data"] }) => {
  return (
    <div className="w-full h-[85vh] flex-col">
      <div className="flex justify-center items-center h-full gap-10 flex-col text-dsmlcBlack">
        <div className="font-redHat lg:text-4xl md:text-3xl text-2xl md:gap-10 gap-5 flex md:flex-row flex-col md:items-end items-center justify-center">
          <ImageTemplate
            image={Data.logo?.dark_logo || ""}
            name={Data.name}
            type="Logo"
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
        <div className="flex-row flex gap-10 items-center">
          {Object.values(SocialMediaData.social_media).map((app) => {
            return (
              <div className="flex items-center text-dsmlcBlack hover:bg-dsmlcTangerine transition-all duration-300 rounded p-1 md:h-10 h-9">
                {" "}
                <a href={app.link} target="_blank">
                  <Image
                    className="md:block hidden"
                    src={app.dark_logo}
                    alt={`${app.name} Logo`}
                    width={30}
                    height={30}
                  />
                  <Image
                    className="md:hidden block"
                    src={app.dark_logo}
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
