import React from "react";
import SocialMedia from "../../public/data/social-media.json";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="fixed bottom-0 bg-dsmlcBlack text-dsmlcWhite w-full p-5 flex lg:flex-row flex-col lg:gap-2 gap-5 text-base justify-evenly items-center">
      <div className="text-center">
        Have questions? Email us at{" "}
        <span className="lg:inline md:hidden">
          <br />
        </span>
        <a
          className="font-semibold pb-1 border-b-2 border-dsmlcDataOrange hover:text-dsmlcDataOrange transition-all duration-300 font-redHat"
          href={`mailto:${SocialMedia.email.link}`}
          target="_blank"
        >
          {SocialMedia.email.link}
        </a>
      </div>
      {Object.values(SocialMedia)
        .filter((app) => app.name !== "Email")
        .map((app) => {
          return (
            !app.logo && (
              <a
                className="font-semibold pb-1 border-b-2 border-dsmlcDataOrange hover:text-dsmlcDataOrange transition-all duration-300 font-redHat"
                href={app.link}
                target="_blank"
              >
                {app.name}
              </a>
            )
          );
        })}
      <div className="flex flex-row gap-5">
        {Object.values(SocialMedia).map((app) => {
          return (
            app.logo && (
              <div className="flex items-center text-white hover:bg-dsmlcDataOrange hover:scale-105 transition-all duration-300 rounded p-1">
                <a href={app.link} target="_blank">
                  <Image
                    src={app.logo}
                    alt={`${app.name} Logo`}
                    width={25}
                    height={25}
                  />
                </a>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default Footer;
