"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import FooterData from "../../public/data/club_links.json";
import { useTheme } from "../ThemeProvider";

export default function ContactPage() {
  const { isDarkMode } = useTheme();
  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-48">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-fullshadow-2xl rounded-4xl overflow-hidden"
      >
        <div className="bg-dsmlcDataOrange p-12 flex flex-col items-center text-center space-y-8">
          <h2 className="text-4xl font-extrabold text-dsmlcWhite font-redHat">
            Get in Touch
          </h2>
          <p className="text-xl dark:text-dark-dsmlcParchment text-light-dsmlcParchment font-quicksand">
            We&apos;d love to hear from you. Send us a message and we&apos;ll
            respond as soon as possible.
          </p>
          <div className="space-y-6">
            {/* Social Media Section */}
            <div className="flex flex-row gap-5">
              {Object.values(FooterData.social_media).map(
                (social_media, index) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center dark:text-dark-dsmlcBlack text-light-dsmlcBlack hover:bg-dsmlcTangerine transition-all duration-300 rounded p-1"
                    >
                      <a
                        href={social_media.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={
                            isDarkMode
                              ? social_media.light_logo
                              : social_media.dark_logo
                          }
                          alt={`${social_media.name} Logo`}
                          width={25}
                          height={25}
                        />
                      </a>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
