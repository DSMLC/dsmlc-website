"use client";
import React, { useEffect, useRef, useState } from "react";
import HeaderData from "../../public/data/pages.json";
import Link from "next/link";
import DSMLCLogo from "../../public/images/DSMLC-logo-white.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NavbarLinksDesktop = () => {
  const pathname = usePathname();

  return (
    <div className="flex-row items-center justify-between lg:gap-10 md:gap-3 lg:flex md:flex sm:hidden hidden ">
      {Object.values(HeaderData).map((page) => {
        return (
          <div key={page.name} className="group relative">
            <Link href={page.link}>
              <div
                className={`${
                  page.link === pathname || pathname.includes(page.link + "/")
                    ? "text-dsmlcDataOrange"
                    : ""
                }  hover:text-dsmlcDataOrange hover:scale-110 transition-all duration-300 p-2 lg:pr-2 md:pr-5 font-medium`}
              >
                {page.name}
              </div>
            </Link>
            {page.type === "dropdown" && (
              <div className="flex-col justify-center absolute left-1/2 transform -translate-x-1/2 hidden group-hover:flex min-w-40 shadow-md shadow-dsmlcWhite bg-dsmlcBlack rounded-lg">
                {Object.values(page.dropdown).map((sub) => {
                  console.log(`/${page.link}/${sub.link}` + " sublink");
                  return (
                    <div key={sub.name}>
                      <Link href={`${page.link}/${sub.link}`}>
                        <div
                          className={`${
                            `${page.link + sub.link}` === pathname
                              ? "text-dsmlcDataOrange"
                              : ""
                          } hover:text-dsmlcDataOrange flex flex-col transition-all duration-150 justify-evenly items-center p-2 rounded-lg bg-dsmlcBlack hover:brightness-150 font-medium`}
                        >
                          <span className="hover:scale-110 transition-all duration-150">
                            {sub.name}
                          </span>
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
  );
};

const NavbarLinksPhone = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState<{ [key: string]: boolean }>({});
  const [isSliding, setIsSliding] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const toggleSidebar = () => {
    if (sidebarOpen) {
      setIsSliding(true);
      setTimeout(() => {
        setSidebarOpen(false);
        setIsSliding(false);
      }, 400);
    } else {
      setSidebarOpen(true);
    }
  };

  const toggleDropdown = (page: string) => {
    setDropdowns((prev) => ({
      ...prev,
      [page]: !prev[page],
    }));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      toggleSidebar();
    }
  };

  useEffect(() => {
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="items-center lg:hidden md:hidden sm:flex flex">
      <button onClick={toggleSidebar}>
        <svg
          className="hover:fill-dsmlcDataOrange fill-dsmlcWhite transition-all duration-300"
          width="40"
          height="40"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="100" height="100" rx="8" fill="transparent" />
          <rect x="15" y="25" width="70" height="10" rx="5" />
          <rect x="15" y="45" width="70" height="10" rx="5" />
          <rect x="15" y="65" width="70" height="10" rx="5" />
        </svg>
      </button>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 ">
          <div
            ref={sidebarRef}
            className={`overflow-y-auto no-scrollbar overflow-x-hidden fixed top-0 right-0 py-14 bg-dsmlcBlack md:w-80 sm:w-64 w-64 h-full shadow-md z-50 shadow-dsmlcWhite ${
              isSliding ? "slide-out" : "slide-in"
            }`}
          >
            <button className="w-full mb-5" onClick={toggleSidebar}>
              <Link href={"/"}>
                <div className="flex flex-col gap-3 items-center hover:text-dsmlcDataOrange transition-colors duration-300">
                  <Image
                    src={DSMLCLogo}
                    alt="DSMLC Logo"
                    className=""
                    width={50}
                  />{" "}
                  <span className="text-3xl font-bold">DSMLC</span>
                </div>
              </Link>{" "}
            </button>

            <div className="flex flex-col">
              {Object.values(HeaderData).map((page) => {
                const isOpen = dropdowns[page.name];
                return (
                  <div key={page.name} className="group relative text-lg">
                    <div className="flex flex-row justify-between">
                      <button
                        className="flex-1 min-w-40"
                        onClick={toggleSidebar}
                      >
                        <Link href={page.link}>
                          <div
                            className={`${
                              page.link === pathname ||
                              pathname.includes(page.link + "/")
                                ? "text-dsmlcDataOrange"
                                : ""
                            }  hover:text-dsmlcDataOrange text-start hover:scale-110 transition-all duration-300 p-5 pl-14 py-3 font-medium`}
                          >
                            {page.name}
                          </div>
                        </Link>
                      </button>
                      {page.type === "dropdown" && (
                        <button
                          className="flex-1 text-sm hover:text-dsmlcDataOrange hover:scale-125 transition-all duration-300"
                          onClick={() => toggleDropdown(page.name)}
                        >
                          {isOpen ? (
                            <span className="text-dsmlcDataOrange">▲</span>
                          ) : (
                            <span>▼</span>
                          )}
                        </button>
                      )}
                    </div>

                    {page.type === "dropdown" && isOpen && (
                      <div className="flex-col text-base justify-center flex min-w-40 rounded-lg">
                        {Object.values(page.dropdown).map((sub) => {
                          console.log(`/${page.link}/${sub.link}` + " sublink");
                          return (
                            <div key={sub.name}>
                              <button
                                className="w-full"
                                onClick={toggleSidebar}
                              >
                                <Link href={`${page.link}/${sub.link}`}>
                                  <div
                                    className={`${
                                      `${page.link + sub.link}` === pathname
                                        ? "text-dsmlcDataOrange"
                                        : ""
                                    } hover:text-dsmlcDataOrange flex flex-col transition-all duration-150 justify-evenly items-center p-2 rounded-lg bg-dsmlcBlack hover:brightness-150 font-medium`}
                                  >
                                    <span className="hover:scale-110 w-full pl-16 text-start transition-all duration-150">
                                      {sub.name}
                                    </span>
                                  </div>
                                </Link>
                              </button>
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
      )}
    </div>
  );
};

export const Header = () => {
  const pathname = usePathname();

  console.log(pathname);
  return (
    <div className="bg-dsmlcBlack ">
      <div className="p-5 px-10 m-auto max-w-7xl flex flex-row text-dsmlcWhite font-redHat justify-between">
        <div className="lg:hidden md:hidden sm:flex flex"></div>
        <Link href={"/"}>
          <div className="flex flex-row gap-3 items-center hover:text-dsmlcDataOrange transition-colors duration-300 flex-end">
            <Image src={DSMLCLogo} alt="DSMLC Logo" className="" width={50} />{" "}
            <span className="text-3xl font-bold">DSMLC</span>
          </div>
        </Link>{" "}
        <NavbarLinksDesktop />
        <NavbarLinksPhone />
      </div>
    </div>
  );
};
