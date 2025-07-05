"use client";
import React from "react";
import Image from "next/image";
import { useTheme } from "@/app/ThemeProvider";



const sizeConfig = {
  Pic: {
    width: {
      large: 600,
      medium: 400,
      small: 300,
    },
    height: {
      large: 300,
      medium: 200,
      small: 150,
    },
  },
  Logo: {
    width: {
      large: 110,
      medium: 90,
      small: 70,
    },
    height: {
      large: 110,
      medium: 90,
      small: 70,
    },
  },
  Sponsor: {
    width: {
      large: 250,
      medium: 330,
      small: 310,
    },
    height: {
      large: 250,
      medium: 330,
      small: 310,
    },
  },
  Banner: {
    width: {
      large: 1200, // Full-width for large screens
      medium: 800,
      small: 600,
    },
    height: {
      large: 300, // Fixed consistent height
      medium: 200,
      small: 150,
    },
  },
};

export type ImageType = "Pic" | "Logo" | "Banner" | "Sponsor";

const getImageClassname = (type: ImageType): string => {
  switch (type) {
    case "Pic":
      return "object-cover self-center object-center min-w-40 h-[300px] max-w-80 border-2 border-dsmlcTangerine rounded-4xl";
    case "Logo":
      return "object-contain";
    case "Sponsor":
      return "object-contain min-w-40 lg:max-w-96 md:max-w-48 max-w-96 max-h-96";
    case "Banner":
      return "object-cover self-center object-center min-w-40 h-[400px] border-4 border-dsmlcTangerine rounded-4xl";
    default:
      return "";
  }
};

const ImageTemplate = ({
  image,
  name,
  type,
}: {
  image: string;
  name: string;
  type: ImageType;
}) => {

  const {isDarkMode} = useTheme();
  
  

  const isInvalidImage = image === "#" || !image;
  const finalType: ImageType = isInvalidImage ? "Logo" : type;
  const defaultImg = isDarkMode ? "/images/light_logo.png" : "/images/dark_logo.png"
  const finalImage = isInvalidImage ? defaultImg : image;

   const imageClassname = getImageClassname(finalType);
  const { width, height } = sizeConfig[finalType];

  return (
    <div>
      {image && (
      
        <>
          <Image
            className={`${imageClassname} lg:block hidden `}
            src={finalImage}
            alt={`${name} ${type}`}
            width={width.large}
            height={height.large}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
          <Image
            className={`${imageClassname} lg:hidden md:block hidden`}
            src={finalImage}
            alt={`${name} ${type}`}
            width={width.medium}
            height={height.medium}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
          <Image
            className={`${imageClassname} md:hidden block`}
            src={finalImage}
            alt={`${name} ${type}`}
            width={width.small}
            height={height.small}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        </>
        )}
    </div>
  );
};

export default ImageTemplate;
