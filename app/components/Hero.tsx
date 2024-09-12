import React from "react";
import LogoData from "../../public/data/logo.json";
import SocialMediaData from "../../public/data/club_links.json";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="w-full h-[85vh] flex-col">
      <div className="flex justify-center items-center h-full gap-10 flex-col text-dsmlcBlack">
        <div className="font-redHat lg:text-4xl md:text-3xl text-2xl md:gap-10 gap-5 flex md:flex-row flex-col md:items-end items-center justify-center">
          <Image
            className="md:block hidden"
            src={LogoData.dark_logo}
            alt={`${LogoData.club_name} Logo`}
            width={110}
            height={110}
          />
          <Image
            className="md:hidden block"
            src={LogoData.dark_logo}
            alt={`${LogoData.club_name} Logo`}
            width={70}
            height={70}
          />
          <div className="flex flex-col md:text-start text-center">
            <span className="md:text-sm text-xs font-light">
              {LogoData.university_name}
            </span>
            <span
              dangerouslySetInnerHTML={{
                __html: LogoData.club_name_styled,
              }}
              className="uppercase"
            ></span>
          </div>
        </div>
        <div className="font-quicksand lg:text-xl md:text-lg text-base lg:w-1/3 sm:w-1/2 w-3/4 text-center">
          {LogoData.description}
        </div>
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

export default Hero;
