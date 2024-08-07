import React from "react";
import LogoData from "../../public/data/logo.json";
import SocialMediaData from "../../public/data/club_links.json";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="w-full h-[75vh] bg-black flex-col">
      <div className="flex justify-center items-center h-full gap-10 flex-col text-dsmlcWhite">
        <div className="font-redHat font-bold lg:text-4xl md:text-3xl text-2xl gap-10 flex md:flex-row flex-col md:items-end items-center justify-center">
          <Image
            src={LogoData.white_logo}
            alt={`${LogoData.club_acronym} Logo`}
            width={110}
            height={110}
          />
          <span className="md:w-1/2 w-3/4 md:text-start text-center">
            {LogoData.club_name}
          </span>
        </div>
        <div className="font-quicksand lg:text-xl md:text-lg text-base lg:w-1/3 sm:w-1/2 w-3/4 text-center">
          {LogoData.description}
        </div>
        <div className="flex-row flex gap-10 items-center">
          {Object.values(SocialMediaData.social_media).map((app) => {
            return (
              <div>
                {" "}
                <a href={app.link} target="_blank">
                  {
                    <Image
                      src={app.logo}
                      alt={`${app.name} Logo`}
                      width={30}
                      height={30}
                    />
                  }
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
