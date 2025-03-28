"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { getConnectedPlayers, getPlayerNames } from "../Backend";
import supabase from "../supabase_client";

interface ConnectedPlayersListProps {
  playerCode: string;
}

interface Player {
  player_id: string;
  name: string;
  linkedin?: string | null;
}

const ConnectedPlayersList: React.FC<ConnectedPlayersListProps> = ({
  playerCode,
}) => {
  const [connectedPlayers, setConnectedPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const loadConnectedPlayers = async () => {
      const connectionCodes = await getConnectedPlayers(playerCode);

      if (connectionCodes.length === 0) {
        setConnectedPlayers([]);
        return;
      }

      const playersData = await getPlayerNames(connectionCodes);

      setConnectedPlayers(playersData);
    };

    loadConnectedPlayers();

    const subscription = supabase
      .channel("realtime:NetworkGraphGameConnections")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "NetworkGraphGameConnections",
        },
        (payload) => {
          if (
            payload.new.first_pair === playerCode ||
            payload.new.second_pair === playerCode
          ) {
            loadConnectedPlayers();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [playerCode]);

  return (
    <div className="lg:min-w-[900px] min-w-full mt-14 p-4 border-dsmlcTangerine border-2 rounded-lg dark:bg-dark-dsmlcWhite bg-light-dsmlcWhite text-dsmlcTangerine">
      <h2 className="text-2xl font-semibold mb-2">
        List of Your Connections Today:
      </h2>
      {connectedPlayers.length === 0 ? (
        <p>No connections yet.</p>
      ) : (
        <ul className="list-disc text-xl pl-5">
          {connectedPlayers.map((player) => (
            <li key={player.player_id}>
              {player.name}
              {player.linkedin && (
                <>
                  {" - "}
                  <a
                    href={player.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
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
