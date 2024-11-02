import { ApplicationTemplateData } from "@/app/DataLoader";
import Link from "next/link";
import React from "react";

const ApplicationSection = ({
  Data,
}: {
  Data: ApplicationTemplateData["data"];
}) => {
  return (
    <div className="bg-dsmlcWhite shadow-xl rounded-4xl overflow-hidden max-w-4xl w-fit m-auto mb-16">
      <div className="p-8 sm:p-12">
        <h2 className="text-3xl font-bold text-dsmlcDataOrange mb-6 font-quicksand">
          {Data.title}
        </h2>

        {Data.descriptions.map((desc) => {
          return <p className="text-lg text-dsmlcBlack mb-8">{desc}</p>;
        })}

        <div className="space-y-4 mb-8">
          <h3 className="text-2xl font-semibold text-dsmlcTangerine font-quicksand">
            {Data.bullets.bulletsTitle}
          </h3>
          <ul className="list-disc list-inside text-dsmlcBlack space-y-2 pl-4">
            {Data.bullets.bullets.map((bullet, index) => (
              <li key={index}>
                <span className="font-bold">{bullet.title} </span>
                {bullet.text}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center">
          <Link
            href={Data.button.buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-lg text-dsmlcWhite bg-dsmlcDataOrange hover:bg-dsmlcTangerine focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dsmlcTangerine transition duration-150 ease-in-out"
          >
            {Data.button.buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSection;
