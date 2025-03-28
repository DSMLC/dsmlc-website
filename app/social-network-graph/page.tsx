"use client";
import React, { useEffect, useState } from "react";
import rawData from "../../public/data/page_data/social_network.json";
import DataLoader, { PageData } from "../DataLoader";
import TitleTemplate from "../components/templates/TitleTemplate1";
import TitleTemplate2 from "../components/templates/TitleTemplate2";
import SubtitleTemplate2 from "../components/templates/SubtitleTemplate3";
import NetworkGraph from "../components/NetworkGraph";
import { addPair, addPlayer, getConnectedPlayers } from "../Backend";
import ConnectedPlayersList from "../components/ConnectedPlayersList";

const SocialNetworkData: PageData[] = rawData as PageData[];

const NotPlayingComponent: React.FC<{
  onSubmitName: (name: string, linkedin?: string) => void;
}> = ({ onSubmitName }) => {
  const [name, setName] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitName(name, linkedin);
  };

  return (
    <div className="px-10 mt-5">
      <TitleTemplate2 Data={{ title: "Enter your name to play the game!" }} />
      <SubtitleTemplate2 Data="Enter your name" />
      <form
        className="lg:min-w-[900px] min-w-full h-50"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="text-2xl w-full p-4 mt-4 mb-6 dark:bg-dark-dsmlcWhite bg-light-dsmlcWhite rounded-lg dark:text-dark-dsmlcBlack text-light-dsmlcBlack placeholder-dsmlcTangerine/70 ring-2 ring-dsmlcTangerine focus:outline-none focus:ring-4 focus:ring-dsmlcDataOrange transition-colors"
        />
        <SubtitleTemplate2 Data="Enter your linkedIn URL (Optional):" />
        <input
          type="text"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          placeholder="Enter your LinkedIn URL (optional)"
          className="text-2xl w-full p-4 mt-4 mb-6 dark:bg-dark-dsmlcWhite bg-light-dsmlcWhite rounded-lg dark:text-dark-dsmlcBlack text-light-dsmlcBlack placeholder-dsmlcTangerine/70 ring-2 ring-dsmlcTangerine focus:outline-none focus:ring-4 focus:ring-dsmlcDataOrange transition-colors"
        />
        <button
          type="submit"
          className={`text-2xl w-full py-3 bg-dsmlcTangerine dark:text-light-dsmlcBlack text-dark-dsmlcBlack font-bold rounded-full relative overflow-hidden transition-colors ${
            isHovering ? "bg-opacity-60" : ""
          }`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <span className="relative z-10">Submit</span>
        </button>
      </form>
    </div>
  );
};

const PlayingComponent: React.FC<{
  playerName: string;
  playerCode: string;
  onSubmitPair: (code1: string, code2: string) => Promise<string | null>;
}> = ({ playerName, playerCode, onSubmitPair }) => {
  const [playerCode2, setPlayerCode2] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errMsg = await onSubmitPair(playerCode, playerCode2);
    setError(errMsg);
    if (!errMsg) {
      setPlayerCode2("");
    }
  };

  return (
    <div>
      <TitleTemplate2 Data={{ title: `Welcome, ${playerName}!` }} />
      <TitleTemplate2 Data={{ title: `Your unique code: ${playerCode}` }} />
      {error && <p className="text-red-500 font-medium">{error}</p>}
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [playerCode, setPlayerCode] = useState(generateCode());

  useEffect(() => {
    const storedPlayerName = localStorage.getItem("playerName");
    const storedPlayerCode = localStorage.getItem("playerCode");

    if (storedPlayerName && storedPlayerCode) {
      setPlayerName(storedPlayerName);
      setPlayerCode(storedPlayerCode);
      setIsPlaying(true);
    }
  }, []);

  const handleSubmitName = async (name: string, linkedin?: string) => {
    const generatedCode = generateCode();

    // Save to localStorage
    setPlayerName(name);
    setPlayerCode(generatedCode);
    localStorage.setItem("playerName", name);
    localStorage.setItem("playerCode", generatedCode);

    await addPlayer(name, generatedCode, "_FINAL_COMP_W2025", linkedin);

    setIsPlaying(true);
  };

  const handleSubmitPair = async (
    pairCode1: string,
    pairCode2: string
  ): Promise<string | null> => {
    return await addPair(pairCode1, pairCode2);
  };

  return (
    <div className="flex flex-col items-center pb-16">
      {SocialNetworkData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
      <NetworkGraph userId={playerCode} />
      {!isPlaying && <NotPlayingComponent onSubmitName={handleSubmitName} />}
      {isPlaying && (
        <>
          <PlayingComponent
            playerName={playerName}
            playerCode={playerCode}
            onSubmitPair={handleSubmitPair}
          />
          <ConnectedPlayersList playerCode={playerCode} />
        </>
      )}
    </div>
  );
};

export default Page;
