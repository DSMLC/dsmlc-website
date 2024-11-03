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
      ? "object-cover self-center object-center min-w-40 lg:max-w-96 md:max-w-80 max-w-96 max-h-96 border-4 border-dsmlcTangerine rounded-4xl"
      : "";
  const largeSize = type === "Pic" ? 999 : 110;
  const medSize = type === "Pic" ? 999 : 90;
  const smallSize = type === "Pic" ? 999 : 70;
  return (
    <div>
      {image && (
        <>
          <Image
            className={`${imageClassname} lg:block hidden`}
            src={image}
            alt={`${name} Logo`}
            width={largeSize}
            height={largeSize}
          />
          <Image
            className={`${imageClassname} lg:hidden md:block hidden`}
            src={image}
            alt={`${name} Logo`}
            width={medSize}
            height={medSize}
          />
          <Image
            className={`${imageClassname} md:hidden block`}
            src={image}
            alt={`${name} Logo`}
            width={smallSize}
            height={smallSize}
          />
        </>
      )}
    </div>
  );
};

export default ImageTemplate;
