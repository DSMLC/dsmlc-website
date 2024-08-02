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
    <div className="bg-[#272635] p-7 pr-12 flex justify-between flex-row text-white">
      <Link href={"/"}>
        <div className="flex flex-row gap-3 items-center">
          <Image src={DSMLCLogo} alt="DSMLC Logo" className="" width={50} />{" "}
          <span className="text-3xl font-semibold">DSMLC</span>
        </div>
      </Link>
      <div className="inline-flex flex-row items-center justify-between">
        {Object.values(Pages)
          .filter((page) => page.type !== "sub")
          .map((page) => {
            return (
              <div className="group relative">
                <Link href={page.link}>
                  <div
                    className={`${
                      page.link === pathname ? "text-dsmlcDataOrange" : ""
                    }  hover:text-dsmlcDataOrange hover:scale-110 transition-transform duration-150 p-4`}
                  >
                    {page.name}{" "}
                  </div>
                </Link>
                {page.type === "dropdown" && (
                  <div className="flex flex-col justify-center absolute left-1/2 transform -translate-x-1/2">
                    {Object.values(page.dropdown).map((sub) => {
                      return (
                        <div>
                          <Link href={sub.link}>
                            <div
                              className={`${
                                sub.link === pathname
                                  ? "text-dsmlcDataOrange"
                                  : ""
                              }  hover:text-dsmlcDataOrange hover:brightness-150 flex flex-col invisible group-hover:visible justify-evenly items-center bg-[#272635] p-2 min-w-40`}
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
  );
};
