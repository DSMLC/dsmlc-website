"use client";
import React, { useState } from "react";
import rawData from "../../public/data/page_data/social_network.json";
import DataLoader, { PageData } from "../DataLoader";
import TitleTemplate from "../components/templates/TitleTemplate1";
import TitleTemplate2 from "../components/templates/TitleTemplate2";
import NetworkGraph from "../components/NetworkGraph";
import { addPair, addPlayer } from "../Backend";

const SocialNetworkData: PageData[] = rawData as PageData[];

const NotPlayingComponent: React.FC<{
  onSubmitName: (name: string) => void;
}> = ({ onSubmitName }) => {
  const [name, setName] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitName(name);
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

const PlayingComponent: React.FC<{
  playerName: string;
  playerCode: string;
  onSubmitPair: (code1: string, code2: string) => void;
}> = ({ playerName, playerCode, onSubmitPair }) => {
  const [playerCode2, setPlayerCode2] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitPair(playerCode, playerCode2);
  };

  return (
    <div>
      <TitleTemplate2 Data={{ title: `Welcome, ${playerName}!` }} />
      <TitleTemplate2 Data={{ title: `Your unique code: ${playerCode}` }} />
      <form
        className="lg:min-w-[900px] min-w-full h-50"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={playerCode2}
          onChange={(e) => setPlayerCode2(e.target.value)}
          placeholder="Enter other's code"
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
          <span className="relative z-10">Submit Other Player</span>
        </button>
      </form>
    </div>
  );
};

const generateCode = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

const Page = () => {
  // // Check local storage for previous session
  // const [isPlaying, setIsPlaying] = useState(
  //   () => localStorage.getItem("playerName") !== null
  // );
  // const [playerName, setPlayerName] = useState(
  //   () => localStorage.getItem("playerName") || ""
  // );
  // const [playerCode, setPlayerCode] = useState(
  //   () => localStorage.getItem("playerCode") || generateCode()
  // );

  // const handleSubmitName = async (name: string) => {
  //   const generatedCode = generateCode();

  //   // Save to localStorage
  //   setPlayerName(name);
  //   setPlayerCode(generatedCode);
  //   localStorage.setItem("playerName", name);
  //   localStorage.setItem("playerCode", generatedCode);

    // Add player to Supabase
    // await addPlayer(name, generatedCode, "_FINAL_COMP_W2025");

  //   // setIsPlaying(true);
  // };

  const handleSubmitPair = async (pairCode1: string, pairCode2: string) => {
    await addPair(pairCode1, pairCode2);
  };

  return (
    <div className="flex flex-col items-center pb-16">
      {SocialNetworkData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
      <NetworkGraph />
      {/* {!isPlaying && <NotPlayingComponent onSubmitName={handleSubmitName} />}
      {isPlaying && (
        <PlayingComponent playerName={playerName} playerCode={playerCode} onSubmitPair={handleSubmitPair} />
      )} */}
    </div>
  );
};

export default Page;
