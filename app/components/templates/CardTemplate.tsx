"use client";
import React from "react";
import ButtonTemplate from "./ButtonTemplate";
import { CardTemplateData } from "../../DataLoader";
import ImageTemplate, { ImageType } from "./ImageTemplate";
import { ImageData } from "../../DataLoader";

const CardTemplate = ({ Data }: { Data: CardTemplateData["data"] }) => {
  // format
  const cardsToDisplay = Data as {
    title: string;
    description?: string;
    StartDate?: string;
    EndDate?: string;
    location?: string;
    image?: ImageData;
    button?: {
      link: string;
      name: string;
    };
  }[];

  return (
    <div className="mt-10 grid gap-6 grid-cols-2">
      {cardsToDisplay.map((card, index) => (
        <div
          key={index}
          className="flex flex-col justify-between p-6 mb-8 bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite border dark:border-dark-dsmlcEnhancedParchment border-light-dsmlcEnhancedParchment shadow-lg dark:shadow-dark-dsmlcParchment shadow-light-dsmlcParchment rounded-4xl"
        >
          <ImageTemplate
            image={card.image?.imageLink || ""}
            name={card.image?.imageName || ""}
            type={card.image?.imageType as ImageType}
          />
          <div className="mt-5">
            {card.title && (
              <span className="font-redHat text-dsmlcTangerine font-semibold text-base md:text-lg">
                {card.title}
              </span>
            )}

            {card.StartDate && (
              <p className="font-redHat text-sm text-gray-500">
                {new Date(card.StartDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                {card.EndDate && (
                  <>
                    {" – "}
                    {new Date(card.EndDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </>
                )}
              </p>
            )}

            {card.location && (
              <p className="font-redHat text-sm text-gray-500 mb-2">
                {card.location}
              </p>
            )}

            {card.description && (
              <p className="dark:text-dark-dsmlcBlack text-light-dsmlcBlack md:text-base text-xs md:px-0 md:text-start">
                {card.description}
              </p>
            )}
          </div>

          {card.button && (
            <div>
              <ButtonTemplate Data={[card.button]} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CardTemplate;
