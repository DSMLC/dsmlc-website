"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { getConnectedPlayers, getPlayerNames } from "../Backend";
import { Link } from "./NetworkGraph";
import clubLinks from "@/public/data/club_links.json";

interface ConnectedPlayersListProps {
  playerCode: string;
  links: Link[];
}

interface Player {
  player_id: string;
  name: string;
  linkedin?: string | null;
}

const ConnectedPlayersList: React.FC<ConnectedPlayersListProps> = ({
  playerCode,
  links,
}) => {
  const [connectedPlayers, setConnectedPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const loadConnectedPlayers = async () => {
      const connectionCodesSet = new Set<string>();
      links.forEach((link) => {
        if (link.source === playerCode) {
          connectionCodesSet.add(link.target);
        } else if (link.target === playerCode) {
          connectionCodesSet.add(link.source);
        }
      });
      const connectionCodes = Array.from(connectionCodesSet);

      if (connectionCodes.length === 0) {
        setConnectedPlayers([]);
        return;
      }

      const playersData = await getPlayerNames(connectionCodes);
      const formattedPlayers = playersData.map((player: Player) => {
        if (player.player_id === "dsmlc") {
          return {
            ...player,
            linkedin: clubLinks.linkedin.link,
          };
        }
        return player;
      });

      setConnectedPlayers(formattedPlayers);
    };

    loadConnectedPlayers();
  }, [playerCode, links]);

  return (
    <div className="md:mx-auto mx-10 lg:w-full max-w-4xl mt-14 p-4 border-dsmlcTangerine border-2 rounded-lg dark:bg-dark-dsmlcWhite bg-light-dsmlcWhite text-dsmlcTangerine">
      <h2 className="md:text-3xl text-xl font-semibold mb-2">
        List of Your Connections Today:
      </h2>
      {connectedPlayers.length === 0 ? (
        <p>No connections yet.</p>
      ) : (
        <ul className="list-disc text-2xl pl-7">
          {connectedPlayers.map((player) => (
            <li key={player.player_id}>
              <span className="dark:text-light-dsmlcParchment light:text-dark-dsmlcParchment">
                {player.name}
              </span>
              {player.linkedin && (
                <>
                  {" - "}
                  <a
                    href={player.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dsmlcTangerine underline"
                  >
                    LinkedIn
                  </a>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConnectedPlayersList;
