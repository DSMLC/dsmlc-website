"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import EmptyProfie from "../../../public/images/profile/empty_profile.svg";
import SubtitleTemplate from "./SubtitleTemplate1";
import Execs from "../../../public/data/execs.json";
import { ProfileListTemplateData } from "@/app/DataLoader";
import { useTheme } from "@/app/ThemeProvider";

export const ProfileListTemplate = ({
  Data,
}: {
  Data: ProfileListTemplateData["data"];
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="px-4 md:px-6 lg:px-8">
      {Data.map((roleGroup, index) => {
        return (
          <div
            key={index}
            style={{ perspective: 1000 }}
            className="flex flex-col gap-10 lg:px-0 lg:w-full max-w-4xl w-fit m-auto lg:text-start text-center mb-16"
          >
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <SubtitleTemplate Data={roleGroup} />
            </div>
            <div className="grid md:grid-cols-3 grid-cols-2 gap-10">
              {Execs.execs
                .filter((exec) =>
                  exec.role.some(
                    (role) => role.group == roleGroup && role.roles.length > 0
                  )
                )
                .map((filteredExec, index) => {
                  return (
                    <motion.div
                      key={index}
                      className="
                      flex flex-col gap-1 text-center justify-between
                      bg-dark-dsmlcBlack dark:bg-light-dsmlcBlack
                      p-4 rounded-3xl
                      transition-shadow
                      shadow-md
                      hover:shadow-2xl
                    "
                      style={{ transformStyle: "preserve-3d" }}
                      whileHover={{
                        scale: 1.07,
                        rotateX: 8,
                        rotateY: 8,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                      }}
                    >
                      <Image
                        src={filteredExec.profile || EmptyProfie || ""}
                        alt="Executive Profile Picture"
                        width={999}
                        height={999}
                        className={`${
                          filteredExec.profile
                            ? "object-cover"
                            : "object-contain p-4"
                        } self-center object-center md:w-32 md:h-32 w-24 h-24 border-4 border-dsmlcTangerine rounded-4xl`}
                      />

                      <span className="font-bold font-redHat text-xl text-dsmlcTangerine mt-2">
                        {filteredExec.name}
                      </span>

                      {filteredExec.program && (
                        <span className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack text-sm italic flex flex-wrap items-center justify-center px-2">
                          {filteredExec.program?.year}
                          {filteredExec.program?.programs?.length > 0 &&
                            filteredExec.program?.programs.map(
                              (program, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="w-full text-center"
                                  >
                                    {program}
                                  </div>
                                );
                              }
                            )}
                        </span>
                      )}

                      {filteredExec.role
                        .filter((role) => role.group === roleGroup)
                        .map((role) =>
                          role.roles.map((roleTitle, index) => (
                            <span
                              className="
                              border-b-2 w-fit self-center border-dsmlcTangerine 
                              dark:text-dark-dsmlcBlack 
                              text-light-dsmlcBlack 
                              font-semibold
                            "
                              key={index}
                            >
                              {roleTitle}
                            </span>
                          ))
                        )}

                      <div
                        className={`flex justify-center m-2 opacity-60 ${
                          isDarkMode
                            ? "text-light-dsmlcWhite"
                            : "text-dark-dsmlcParchment"
                        }`}
                      >
                        <div
                        // className={`flex gap-2 ${
                        //   filteredExec.joinDate === ""
                        //     ? "invisible"
                        //     : "visible"
                        // }`}
                        >
                          {filteredExec.joinDate !== "" && (
                            <p className="text-xs">
                              Member Since:{" "}
                              <span className="text-xs">
                                {filteredExec.joinDate}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-center">
                        {filteredExec.linkedin === "" ? (
                          <div className="w-8 h-8"></div>
                        ) : (
                          <a href={filteredExec.linkedin} className="group">
                            <Image
                              src={
                                isDarkMode
                                  ? "/images/light_linkedin.svg"
                                  : "/images/dark_linkedin.svg"
                              }
                              alt="linkedin_icon"
                              width={25}
                              height={25}
                              className="opacity-70 group-hover:opacity-100 group-hover:brightness-0 group-hover:invert transition"
                            />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
