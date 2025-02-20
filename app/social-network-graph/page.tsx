"use client";
import React, { useState } from "react";
import rawData from "../../public/data/page_data/social_network.json";
import DataLoader, { PageData } from "../DataLoader";
import TitleTemplate from "../components/templates/TitleTemplate1";
import TitleTemplate2 from "../components/templates/TitleTemplate2";
import NetworkGraph from "../components/NetworkGraph";

const SocialNetworkData: PageData[] = rawData as PageData[];

const NotPlayingComponent: React.FC<{
  setIsPlaying: (value: boolean) => void;
}> = ({ setIsPlaying }) => {
  const [name, setName] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Submitted code:", name);
    setIsPlaying(true);
  };
  return (
    <div className="px-10 mt-5">
      <TitleTemplate2 Data={{ title: "Enter your name to play the game!" }} />

      <form
        className="lg:min-w-[900px] min-w-full h-50"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="text-2xl w-full p-4 my-4 mb-10 dark:bg-dark-dsmlcWhite bg-light-dsmlcWhite rounded-lg dark:text-dark-dsmlcBlack text-light-dsmlcBlack placeholder-dsmlcTangerine/70 ring-2 ring-dsmlcTangerine focus:outline-none focus:ring-4 focus:ring-dsmlcDataOrange transition-colors"
        />
        <button
          type="submit"
          className={`text-2xl w-full py-3 bg-dsmlcTangerine dark:text-light-dsmlcBlack text-dark-dsmlcBlack font-bold rounded-full relative overflow-hidden transition-colors ${
            isHovering ? "bg-opacity-60" : ""
          }`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <span className="relative z-10">Submit Name</span>
        </button>
      </form>
    </div>
  );
};

const Page = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col items-center pb-16">
      {SocialNetworkData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
      <NetworkGraph />
      {!isPlaying && <NotPlayingComponent setIsPlaying={setIsPlaying} />}
      {isPlaying && <div>Playing</div>}
      {/* <TitleTemplate2 Data={{ title: "Your unique code: " }} />
      <TitleTemplate2 Data={{ title: "XKJ921" }} /> */}

      {/* <div className="w-full max-w-xl bg-[#242424] border border-[#FF9B5E]/20 rounded-lg p-8">
        <h2 className="text-[#FF9B5E] text-2xl font-bold mb-6">
          Enter Unique Code
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter the unique code"
            className="w-full px-3 py-2 mb-4 bg-[#1C1C1C] border border-[#FF9B5E]/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#FF9B5E] transition-colors"
          />
          <button
            type="submit"
            className={`w-full py-3 bg-[#FF9B5E] text-black font-bold rounded-full relative overflow-hidden transition-colors ${
              isHovering ? "bg-opacity-90" : ""
            }`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <span className="relative z-10">Submit Code</span>
            <span
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${
                isHovering
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-2"
              }`}
            >
              →
            </span>
          </button>
        </form>
      </div>*/}
    </div>
  );
};

export default Page;
