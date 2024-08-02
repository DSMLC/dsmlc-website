"use client";
import React from "react";
import Pages from "../../public/data/pages.json";
import Link from "next/link";
import DSMLCLogo from "../../public/DSMLC-logo-white.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();

  console.log(pathname);
  return (
    <div className="bg-dsmlcBlack ">
      <div className="p-5 px-10 m-auto max-w-7xl flex flex-row text-dsmlcWhite font-redHat lg:justify-between md:justify-center sm:justify-center justify-center">
        <Link href={"/"}>
          <div className="flex flex-row gap-3 items-center hover:text-dsmlcDataOrange transition-colors duration-300">
            <Image src={DSMLCLogo} alt="DSMLC Logo" className="" width={50} />{" "}
            <span className="text-3xl font-bold">DSMLC</span>
          </div>
        </Link>
        <div className="flex-row items-center justify-between gap-10 lg:flex md:hidden sm:hidden hidden">
          {Object.values(Pages).map((page) => {
            return (
              <div className="group relative">
                <Link href={page.link}>
                  <div
                    className={`${
                      page.link === pathname ||
                      pathname.includes(page.link + "/")
                        ? "text-dsmlcDataOrange"
                        : ""
                    }  hover:text-dsmlcDataOrange hover:scale-110 transition-all duration-300 p-2 font-medium`}
                  >
                    {page.name}
                  </div>
                </Link>
                {page.type === "dropdown" && (
                  <div className="flex-col justify-center absolute left-1/2 transform -translate-x-1/2 group-hover:flex hidden min-w-40 shadow-md shadow-dsmlcWhite bg-dsmlcBlack rounded-lg">
                    {page.hasOwnProperty("dropdown") &&
                      Object.values(page.dropdown).map((sub) => {
                        console.log(`/${page.link}/${sub.link}` + " sublink");
                        return (
                          <div>
                            <Link href={`${page.link}/${sub.link}`}>
                              <div
                                className={`${
                                  `${page.link + sub.link}` === pathname
                                    ? "text-dsmlcDataOrange"
                                    : ""
                                } hover:text-dsmlcDataOrange flex flex-col invisible group-hover:visible justify-evenly items-center p-2 rounded-lg bg-dsmlcBlack hover:brightness-150 font-medium`}
                              >
                                {sub.name}
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
