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
  if (type === "Pic") {
    return (
      <div className="relative flex justify-center">
        <div className="relative w-fit">
          <Image
            className="rounded-4xl border-4 border-dsmlcTangerine object-cover"
            src={image}
            alt={`${name} ${type}`}
            width={400}
            height={600}
            style={{
              maxWidth: '100%',
              height: 'auto',
              maxHeight: '600px',
            }}
          />
        </div>
      </div>
    );
  }

  // For carousel/banner images
  return (
    <div className="relative w-full h-full">
      <Image
        className="rounded-5xl object-cover"
        src={image}
        alt={`${name} ${type}`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
        priority={type === "Banner"}
      />
    </div>
  );
};

export default ImageTemplate;