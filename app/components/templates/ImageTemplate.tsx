"use client";
import React from "react";
import Image from "next/image";

const sizeConfig = {
  Pic: {
    width: {
      large: 999,
      medium: 999,
      small: 999,
    },
    height: {
      large: 999,
      medium: 999,
      small: 999,
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

const loaderProp = ({ src }: { src: string }) => {
  return src;
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
  const { width, height } = sizeConfig[type];

  const imageClassname = getImageClassname(type);

  return (
    <div>
      {image && (
        <>
          <Image
            className={`${imageClassname} lg:block hidden `}
            src={image}
            alt={`${name} ${type}`}
            width={width.large}
            height={height.large}
            loader={loaderProp}
          />
          <Image
            className={`${imageClassname} lg:hidden md:block hidden`}
            src={image}
            alt={`${name} ${type}`}
            width={width.medium}
            height={height.medium}
            loader={loaderProp}
          />
          <Image
            className={`${imageClassname} md:hidden block`}
            src={image}
            alt={`${name} ${type}`}
            width={width.small}
            height={height.small}
            loader={loaderProp}
          />
        </>
      )}
    </div>
  );
};

export default ImageTemplate;
