"use client";

import { useState } from "react";
import { CheckIcon, ArrowRightIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function Component() {
  const [isHovered, setIsHovered] = useState(false);

  const benefits = [
    "Exclusive content",
    "Community access",
    "Monthly newsletter",
    "And much more!",
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 font-redHat">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-5xl font-extrabold text-center text-dsmlcDataOrange mb-8 leading-tight">
          Become a Member
        </h1>
        <p className="text-2xl text-center dark:text-dark-dsmlcBlack text-light-dsmlcBlack mb-12 font-quicksand">
          Join our community and unlock exclusive benefits
        </p>

        <div className="mb-12 bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite  border-2 border-dsmlcTangerine shadow-lg rounded-4xl overflow-hidden">
          <div className="text-center bg-gradient-to-r from-dsmlcDataOrange to-dsmlcTangerine p-6">
            <h2 className="text-3xl font-bold text-light-dsmlcWhite dark:text-dark-dsmlcWhite ">
              Membership Benefits
            </h2>
            <p className="text-light-dsmlcWhite dark:text-dark-dsmlcWhite  text-lg mt-2">
              What you&apos;ll get when you join
            </p>
          </div>
          <div className="p-8">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center dark:bg-dark-dsmlcParchment bg-light-dsmlcParchment rounded-xl p-4 shadow-sm"
                >
                  <CheckIcon className="h-6 w-6 text-dsmlcDataOrange mr-3 flex-shrink-0" />
                  <span className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack text-lg">
                    {benefit}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a
              href="https://forms.gle/gdrUFv7LrY6Tfjmj7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-6 text-xl bg-dsmlcDataOrange hover:bg-dsmlcTangerine text-light-dsmlcWhite dark:text-dark-dsmlcWhite  rounded-full shadow-lg transition-all duration-300 ease-in-out"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Join Now
              <ArrowRightIcon
                className={`ml-2 h-5 w-5 transition-transform duration-300 ${
                  isHovered ? "translate-x-1" : ""
                }`}
              />
            </a>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 text-center text-lg dark:text-dark-dsmlcBlack text-light-dsmlcBlack font-quicksand"
        ></motion.p>
      </motion.div>
    </div>
  );
}
