"use client";
import React from "react";
import FooterData from "../../public/data/club_links.json";
import SocialLinksTemplate from "./templates/SocialLinksTemplate";
import { updateButtonClicksDatabase } from "../Backend";

const Footer = () => {
  const links = [
    FooterData.membership,
    FooterData.workshops,
    FooterData.clubhub,
  ];
  return (
    <div className="static bottom-0 dark:bg-dark-dsmlcWhite bg-light-dsmlcWhite dark:text-dark-dsmlcBlack text-light-dsmlcBlack w-full p-5 flex lg:flex-row flex-col lg:gap-2 gap-5 text-base justify-evenly items-center h-full min-h-24 border-t-2 border-dsmlcTangerine">
      <div className="text-center">
        {FooterData.email_section.description}
        <span className="lg:inline md:hidden">
          <br />
        </span>
        <a
          onClick={() =>
            updateButtonClicksDatabase(`Go ${FooterData.email_section.name}`)
          }
          className="font-semibold pb-1 border-b-2 border-dsmlcDataOrange hover:text-dsmlcDataOrange transition-all duration-300 font-redHat"
          href={`mailto:${FooterData.email_section.link}`}
          target="_blank"
        >
          {FooterData.email_section.text}
        </a>
      </div>
      <div className="flex md:flex-row lg:w-1/2 md:w-full md:gap-12 md:justify-center lg:justify-evenly gap-5 w-fit flex-col items-center">
        {Object.values(links).map((link, index) => {
          return (
            <a
              onClick={() => updateButtonClicksDatabase(`Go ${link.name}`)}
              key={index}
              className="font-semibold pb-1 border-b-2 border-dsmlcDataOrange hover:text-dsmlcDataOrange transition-all duration-300 font-redHat w-fit"
              href={link.link}
              target="_blank"
            >
              {link.name}
            </a>
          );
        })}
      </div>
      <SocialLinksTemplate Data={""} />
    </div>
  );
};

export default Footer;
