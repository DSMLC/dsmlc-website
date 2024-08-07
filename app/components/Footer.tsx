import React from "react";
import FooterData from "../../public/data/footer.json";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="fixed bottom-0 bg-dsmlcBlack text-dsmlcWhite w-full p-5 flex lg:flex-row flex-col lg:gap-2 gap-5 text-base justify-evenly items-center">
      <div className="text-center">
        {FooterData.email_section.description}
        <span className="lg:inline md:hidden">
          <br />
        </span>
        <a
          className="font-semibold pb-1 border-b-2 border-dsmlcDataOrange hover:text-dsmlcDataOrange transition-all duration-300 font-redHat"
          href={`mailto:${FooterData.email_section.link}`}
          target="_blank"
        >
          {FooterData.email_section.link}
        </a>
      </div>
      <div className="flex md:flex-row lg:w-1/2 md:w-full md:gap-12 md:justify-center lg:justify-evenly gap-5 w-fit flex-col items-center">
        {Object.values(FooterData.links_section).map((links) => {
          return (
            <a
              className="font-semibold pb-1 border-b-2 border-dsmlcDataOrange hover:text-dsmlcDataOrange transition-all duration-300 font-redHat w-fit"
              href={links.link}
              target="_blank"
            >
              {links.name}
            </a>
          );
        })}{" "}
      </div>
      <div className="flex flex-row gap-5">
        {Object.values(FooterData.social_media).map((social_media) => {
          return (
            <div className="flex items-center text-white hover:bg-dsmlcDataOrange hover:scale-105 transition-all duration-300 rounded p-1">
              <a href={social_media.link} target="_blank">
                <Image
                  src={social_media.logo}
                  alt={`${social_media.name} Logo`}
                  width={25}
                  height={25}
                />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Footer;
