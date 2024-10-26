import React from "react";
import Image from "next/image";

const ImageTemplate = ({ image, name }: { image: string; name: string }) => {
  return (
    <div>
      {image && (
        <>
          <Image
            className="lg:block hidden"
            src={image}
            alt={`${name} Logo`}
            width={110}
            height={110}
          />
          <Image
            className="lg:hidden md:block hidden"
            src={image}
            alt={`${name} Logo`}
            width={90}
            height={90}
          />
          <Image
            className="md:hidden block"
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
