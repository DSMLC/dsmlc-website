import React from "react";
import Pages from "../../../public/data/pages.json";
import Link from "next/link";

export const Header = () => {
  return (
    <div className="flex justify-end flex-row gap-5 bg-dsmlcParchment p-7 pr-12">
      {Object.values(Pages).map((page) => {
        return (
          <div>
            <Link href={page.link}>{page.name}</Link>
          </div>
        );
      })}
    </div>
  );
};
