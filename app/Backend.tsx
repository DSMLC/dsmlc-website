"use client";
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
  gameId: string
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

export const addPair = async (pairCode1: string, pairCode2: string) => {
  const { error: insertError } = await supabase
    .from("NetworkGraphGameConnections")
    .insert({
      first_pair: pairCode1,
      second_pair: pairCode2,
    });

  if (insertError) console.error("Error inserting pair:", insertError);
};
