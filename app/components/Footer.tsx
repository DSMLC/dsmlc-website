"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import FooterData from "../../public/data/club_links.json";
import SocialLinksTemplate from "./templates/SocialLinksTemplate";
import { updateButtonClicksDatabase } from "../Backend";

const iconVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.2,
    rotate: 3,
    transition: { type: "spring", stiffness: 300 },
  },
  tap: { scale: 0.95, rotate: 3 },
};

const Footer = () => {
  const links = [
    FooterData.membership,
    FooterData.workshops,
    FooterData.clubhub,
  ];

  return (
    <div className="dark:bg-dark-dsmlcWhite bg-light-dsmlcWhite dark:text-dark-dsmlcBlack text-light-dsmlcBlack w-full p-5 flex lg:flex-row flex-col lg:gap-2 gap-5 text-base justify-between items-center min-h-24 border-t-2 border-dsmlcTangerine">
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
        {links.map((link, index) => (
          <a
            onClick={() => updateButtonClicksDatabase(`Go ${link.name}`)}
            key={index}
            className="font-semibold pb-1 border-b-2 border-dsmlcDataOrange hover:text-dsmlcDataOrange transition-all duration-300 font-redHat w-fit"
            href={link.link}
            target="_blank"
          >
            {link.name}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <SocialLinksTemplate Data={""} />

        <motion.div
          className="relative"
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <motion.div
            className="
              flex items-center justify-center w-12 h-12 rounded-full
              dark:bg-light-dsmlcBlack bg-dark-dsmlcBlack
              hover:shadow-xl transition-shadow duration-300
              dark:shadow-dark-dsmlcParchment shadow-light-dsmlcParchment
            "
            variants={iconVariants}
          >
            <a
              href="/admin-dash"
              onClick={() => updateButtonClicksDatabase("Go Admin")}
              aria-label="Admin dashboard"
              className="flex items-center justify-center w-full h-full"
            >
              <Image
                src="/images/user-admin.svg"
                alt="Admin Logo"
                width={28}
                height={28}
                className="transition-transform duration-300 invert brightness-0"
              />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Footer;
