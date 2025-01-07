"use client";
import supabase from "./supabase_client"

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
