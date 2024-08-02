import React from "react";
import Pages from "../../../public/data/pages.json";
import Link from "next/link";
import DSMLCLogo from "../../../public/DSMLC-logo.png";
import Image from "next/image";

export const Header = () => {
  return (
    <div className="bg-dsmlcParchment p-7 pr-12 flex justify-between flex-row">
      <Link href={"/"}>
        <div className="flex flex-row gap-3 items-center">
          <Image src={DSMLCLogo} alt="DSMLC Logo" className="" width={50} />{" "}
          <span className="text-3xl font-semibold">DSMLC</span>
        </div>
      </Link>
      <div className="flex flex-row gap-5 items-center">
        {Object.values(Pages).map((page) => {
          return (
            <div>
              <Link href={page.link}>{page.name}</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
