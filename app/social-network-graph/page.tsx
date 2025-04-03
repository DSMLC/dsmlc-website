"use client";
import React, { useEffect, useState } from "react";
import rawData from "../../public/data/page_data/social_network.json";
import DataLoader, { PageData } from "../DataLoader";
import TitleTemplate from "../components/templates/TitleTemplate1";
import TitleTemplate2 from "../components/templates/TitleTemplate2";
import SubtitleTemplate2 from "../components/templates/SubtitleTemplate3";
import NetworkGraph from "../components/NetworkGraph";
import {
  addPair,
  addPlayer,
  checkPlayerInDatabase,
  getConnectedPlayers,
  updatePlayer,
} from "../Backend";
import ConnectedPlayersList from "../components/ConnectedPlayersList";
import { useConnectionLinks } from "../useConnectionLinks";

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
          placeholder="Enter your LinkedIn URL (Optional)"
          className="text-2xl w-full p-4 mt-4 mb-6 dark:bg-dark-dsmlcWhite bg-light-dsmlcWhite rounded-lg dark:text-dark-dsmlcBlack text-light-dsmlcBlack placeholder-dsmlcTangerine/70 ring-2 ring-dsmlcTangerine focus:outline-none focus:ring-4 focus:ring-dsmlcDataOrange transition-colors"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className={`text-2xl w-full py-3 font-bold rounded-full relative overflow-hidden transition-colors ${
            isHovering ? "bg-opacity-60" : ""
          } ${
            !name.trim()
              ? "bg-dsmlcTangerine/25 cursor-not-allowed"
              : "bg-dsmlcTangerine dark:text-light-dsmlcBlack text-dark-dsmlcBlack"
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
  playerLinkedin?: string;
  playerCode: string;
  onSubmitPair: (code1: string, code2: string) => Promise<string | null>;
  onUpdateProfile: (newName: string, newLinkedin: string) => void;
  isConnectedWithDSMLC: boolean;
}> = ({
  playerName,
  playerLinkedin,
  playerCode,
  onSubmitPair,
  onUpdateProfile,
  isConnectedWithDSMLC,
}) => {
  const [playerCode2, setPlayerCode2] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState(playerName);
  const [editedLinkedin, setEditedLinkedin] = useState(playerLinkedin || "");

  useEffect(() => {
    setEditedName(playerName);
  }, [playerName]);

  useEffect(() => {
    setEditedLinkedin(playerLinkedin || "");
  }, [playerLinkedin]);

  const handleEditSave = async () => {
    if (!editedName.trim()) {
      setError("Name cannot be blank.");
      return;
    }
    const success = await updatePlayer(playerCode, editedName, editedLinkedin);
    if (success) {
      localStorage.setItem("playerName", editedName);
      localStorage.setItem("playerLinkedin", editedLinkedin || "");
      onUpdateProfile(editedName, editedLinkedin);
      setEditMode(false);
    } else {
      setError("Error updating profile. Please try again.");
    }
  };

  return (
    <div className="px-10">
      {editMode ? (
        <div className="mb-6 mt-5">
          <SubtitleTemplate2 Data="Edit your name:" />
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="md:text-2xl text-lg w-full p-4 mb-6 mt-2 dark:bg-dark-dsmlcWhite bg-light-dsmlcWhite rounded-lg dark:text-dark-dsmlcBlack text-light-dsmlcBlack placeholder-dsmlcTangerine/70 ring-2 ring-dsmlcTangerine focus:outline-none focus:ring-4 focus:ring-dsmlcDataOrange transition-colors"
          />
          <SubtitleTemplate2 Data="Edit your LinkedIn URL:" />
          <input
            type="text"
            value={editedLinkedin}
            onChange={(e) => setEditedLinkedin(e.target.value)}
            placeholder="Optional"
            className="md:text-2xl text-lg w-full p-4 mb-4 mt-2 dark:bg-dark-dsmlcWhite bg-light-dsmlcWhite rounded-lg dark:text-dark-dsmlcBlack text-light-dsmlcBlack placeholder-dsmlcTangerine/70 ring-2 ring-dsmlcTangerine focus:outline-none focus:ring-4 focus:ring-dsmlcDataOrange transition-colors"
          />
          <div className="flex justify-end gap-4">
            <button
              onClick={handleEditSave}
              className="md:text-xl text-base font-bold py-3 px-6 bg-dsmlcTangerine text-light-dsmlcBlack rounded-full"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="md:text-xl text-base font-bold py-3 px-6 bg-dsmlcTangerine text-light-dsmlcBlack rounded-full"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <TitleTemplate2 Data={{ title: `Welcome, ${playerName}!` }} />

          <TitleTemplate2 Data={{ title: `Your unique code: ${playerCode}` }} />
          {playerLinkedin && (
            <div className="flex justify-center">
              <div className="lg:text-xl md:text-lg text-md font-semibold font-redHat dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                LinkedIn:{" "}
                <span className="text-dsmlcTangerine underline">
                  <a
                    href={playerLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {playerLinkedin}
                  </a>
                </span>
              </div>
            </div>
          )}
          {!playerLinkedin && (
            <div className="flex justify-center">
              <div className="lg:text-xl md:text-lg text-md font-semibold font-redHat dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                Edit Profile to add LinkedIn URL to your Profile
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={() => setEditMode(true)}
              className="md:text-xl text-base font-bold py-2 px-4 bg-dsmlcTangerine text-light-dsmlcBlack rounded-full mt-4"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-red-500 font-medium">{error}</p>}
      <form
        className="lg:min-w-[900px] min-w-full h-50"
        onSubmit={async (e) => {
          e.preventDefault();
          const errMsg = await onSubmitPair(playerCode, playerCode2);
          setError(errMsg);
          if (!errMsg) {
            setPlayerCode2("");
          }
        }}
      >
        <SubtitleTemplate2 Data="Enter the code of people you meet:" />
        {!isConnectedWithDSMLC && (
          <SubtitleTemplate2 Data="Try connecting with the Club by typing code 'DSMLC':" />
        )}
        <input
          type="text"
          value={playerCode2}
          onChange={(e) => setPlayerCode2(e.target.value)}
          placeholder="Enter other people's code"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="md:text-2xl text-lg w-full p-4 my-4 mb-10 dark:bg-dark-dsmlcWhite bg-light-dsmlcWhite rounded-lg dark:text-dark-dsmlcBlack text-light-dsmlcBlack placeholder-dsmlcTangerine/70 ring-2 ring-dsmlcTangerine focus:outline-none focus:ring-4 focus:ring-dsmlcDataOrange transition-colors"
        />
        <button
          type="submit"
          className={`md:text-2xl text-lg w-full py-3 bg-dsmlcTangerine text-light-dsmlcBlack font-bold rounded-full relative overflow-hidden transition-colors ${
            isHovering ? "bg-opacity-60" : ""
          }`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <span className="md:text-xl text-base relative z-10">
            Submit Other Player Code
          </span>
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
  const [playerLinkedin, setPlayerLinkedin] = useState("");
  const [playerCode, setPlayerCode] = useState(generateCode());
  const links = useConnectionLinks();
  const [isConnectedWithDSMLC, setIsConnectedWithDSMLC] = useState(false);

  useEffect(() => {
    const verifyAndSetPlayer = async () => {
      const storedPlayerName = localStorage.getItem("playerName");
      const storedPlayerCode = localStorage.getItem("playerCode");
      const storedPlayerLinkedin = localStorage.getItem("playerLinkedin");

      if (storedPlayerName && storedPlayerCode) {
        const exists = await checkPlayerInDatabase(storedPlayerCode);

        if (exists) {
          setPlayerName(storedPlayerName);
          setPlayerCode(storedPlayerCode);
          setPlayerLinkedin(storedPlayerLinkedin || "");
          setIsPlaying(true);
        } else {
          // Clear invalid data
          localStorage.removeItem("playerName");
          localStorage.removeItem("playerCode");
          localStorage.removeItem("playerLinkedin");
        }
      }
    };

    verifyAndSetPlayer();
  }, []);

  useEffect(() => {
    const hasDSMLCConnection = links.some(
      (link) =>
        (link.source === playerCode && link.target === "dsmlc") ||
        (link.target === playerCode && link.source === "dsmlc")
    );
    setIsConnectedWithDSMLC(hasDSMLCConnection);
  }, [playerCode, links]);

  const handleSubmitName = async (name: string, linkedin?: string) => {
    const generatedCode = generateCode();

    // Save to localStorage
    setPlayerName(name);
    setPlayerLinkedin(linkedin || "");
    setPlayerCode(generatedCode);
    localStorage.setItem("playerName", name);
    localStorage.setItem("playerCode", generatedCode);
    localStorage.setItem("playerLinkedin", linkedin || "");

    await addPlayer(name, generatedCode, "_FINAL_COMP_W2025", linkedin);

    setIsPlaying(true);
  };

  const handleSubmitPair = async (
    pairCode1: string,
    pairCode2: string
  ): Promise<string | null> => {
    return await addPair(pairCode1, pairCode2);
  };

  const updateProfile = (newName: string, newLinkedin: string) => {
    setPlayerName(newName);
    setPlayerLinkedin(newLinkedin);
  };

  return (
    <div className="flex flex-col items-center pb-16">
      {SocialNetworkData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
      <NetworkGraph userId={playerCode} links={links} />
      {!isPlaying && <NotPlayingComponent onSubmitName={handleSubmitName} />}
      {isPlaying && (
        <>
          <PlayingComponent
            playerName={playerName}
            playerLinkedin={playerLinkedin}
            playerCode={playerCode}
            onSubmitPair={handleSubmitPair}
            onUpdateProfile={updateProfile}
            isConnectedWithDSMLC={isConnectedWithDSMLC}
          />
          <ConnectedPlayersList playerCode={playerCode} links={links} />
        </>
      )}
    </div>
  );
};

export default Page;
