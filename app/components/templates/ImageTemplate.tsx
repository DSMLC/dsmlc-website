import React from "react";
import Image from "next/image";

const ImageTemplate = ({
  image,
  name,
  type,
}: {
  image: string;
  name: string;
  type: string;
}) => {
  const imageClassname =
    type === "Pic"
      ? "object-cover self-center object-center min-w-44 min-h-44 border-4 border-dsmlcTangerine rounded-4xl"
      : "";
  return (
    <div>
      {image && (
        <>
          <Image
            className={`${imageClassname} lg:block hidden`}
            src={image}
            alt={`${name} Logo`}
            width={110}
            height={110}
          />
          <Image
            className={`${imageClassname} lg:hidden md:block hidden`}
            src={image}
            alt={`${name} Logo`}
            width={90}
            height={90}
          />
          <Image
            className={`${imageClassname} md:hidden block`}
            src={image}
            alt={`${name} Logo`}
            width={70}
            height={70}
          />
        </>
      )}
    </div>
  );
};

export default ImageTemplate;
