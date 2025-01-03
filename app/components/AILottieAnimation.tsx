"use client";
import React, { useState } from "react";
import Lottie from "react-lottie-player";
import aiAnimationData from "../../public/images/LottieAnimation.json";

const AILottieAnimation = () => {
  const [direction, setDirection] = useState<1 | -1>(1);

  return (
    <div className="w-16 h-16 lg:w-20 lg:h-20">
      <Lottie
        animationData={aiAnimationData}
        play
        loop={false}
        direction={direction}
        onComplete={() => setDirection((prev) => (prev === 1 ? -1 : 1))}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default AILottieAnimation;
