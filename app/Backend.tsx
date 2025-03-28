"use client";
import { Link } from "./components/NetworkGraph";
import supabase from "./supabase_client";

export const updateButtonClicksDatabase = async (buttonName: string) => {
  const { data, error: fetchError } = await supabase
    .from("ButtonClicks")
    .select("click_count")
    .eq("button_name", buttonName)
    .maybeSingle();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.log("Error fetching button click:", fetchError);
    return;
  }

  if (data) {
    const { error: updateError } = await supabase
      .from("ButtonClicks")
      .update({ click_count: data.click_count + 1 })
      .eq("button_name", buttonName);

    if (updateError) console.log("Error updating button click:", updateError);
  } else {
    const { error: insertError } = await supabase
      .from("ButtonClicks")
      .insert({ button_name: buttonName, click_count: 1 });

    if (insertError) console.log("Error inserting button click:", insertError);
  }
};

export const addPlayer = async (
  playerName: string,
  playerId: string,
  gameId: string,
  linkedin?: string
) => {
  const { data: existingPlayer, error: fetchError } = await supabase
    .from("NetworkGraphGameNames")
    .select("player_id")
    .eq("player_id", playerId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error checking for existing player:", fetchError);
    return;
  }

  if (existingPlayer) {
    console.log("Player already exists, skipping insert.");
    return;
  }

  // Insert new player
  const { error: insertError } = await supabase
    .from("NetworkGraphGameNames")
    .insert({
      name: playerName,
      player_id: playerId,
      game_id: gameId,
      connection_count: 0,
      linkedin: linkedin || null,
    });

  if (insertError) console.error("Error inserting player:", insertError);
};

export const fetchNodes = async () => {
  const { data, error } = await supabase
    .from("NetworkGraphGameNames")
    .select("player_id, name, connection_count");

  if (error) {
    console.error("Error fetching nodes:", error);
    return [];
  }

  return data.map((node: any) => ({
    id: node.player_id,
    name: node.name,
    connections: node.connection_count,
    x: Math.random() * 500,
    y: Math.random() * 500,
    vx: 0,
    vy: 0,
  }));
};

export const getConnectedPlayers = async (
  playerCode: string
): Promise<string[]> => {
  const { data, error } = await supabase
    .from("NetworkGraphGameConnections")
    .select("first_pair, second_pair")
    .or(`first_pair.eq.${playerCode},second_pair.eq.${playerCode}`);

  if (error || !data) {
    console.error("Error fetching connections:", error);
    return [];
  }
  const connectedPlayerCodes = new Set<string>();

  data.forEach((pair) => {
    if (pair.first_pair === playerCode) {
      connectedPlayerCodes.add(pair.second_pair);
    } else if (pair.second_pair === playerCode) {
      connectedPlayerCodes.add(pair.first_pair);
    }
  });

  return Array.from(connectedPlayerCodes);
};

export const getPlayerNames = async (
  playerCodes: string[]
): Promise<{ player_id: string; name: string }[]> => {
  const { data: playersData, error: playersError } = await supabase
    .from("NetworkGraphGameNames")
    .select("player_id, name, linkedin")
    .in("player_id", playerCodes);

  if (playersError || !playersData) {
    console.error("Error fetching player names:", playersError);
    return [];
  }

  return playersData;
};

export const addPair = async (
  pairCode1: string,
  pairCode2: string
): Promise<string | null> => {
  if (pairCode1 === pairCode2) {
    return "You cannot pair with yourself.";
  }

  // Check if playerCode2 exists
  const { data: playerData, error: playerFetchError } = await supabase
    .from("NetworkGraphGameNames")
    .select("player_id")
    .eq("player_id", pairCode2)
    .single();

  if (playerFetchError || !playerData) {
    return "The player code you entered does not exist.";
  }

  // Check for existing connection
  const connectedPlayers = await getConnectedPlayers(pairCode1);
  if (connectedPlayers.includes(pairCode2)) {
    return "You are already connected with this player or the other player connected with you.";
  }

  // Insert new pair
  const { error: insertError } = await supabase
    .from("NetworkGraphGameConnections")
    .insert({
      first_pair: pairCode1,
      second_pair: pairCode2,
    });

  if (insertError) {
    console.error("Error inserting pair:", insertError);
    return "An error occurred while trying to connect.";
  }

  return null;
};

export const fetchLinks = async (): Promise<Link[]> => {
  const { data, error } = await supabase
    .from("NetworkGraphGameConnections")
    .select("first_pair, second_pair");

  if (error || !data) {
    console.error("Error fetching links:", error);
    return [];
  }

  // Map each row into a Link object.
  return data.map((connection: any) => ({
    source: connection.first_pair,
    target: connection.second_pair,
    weight: 1, // You can adjust weight as needed
  }));
};
