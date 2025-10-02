// discord-bot/commands/events.js
const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

// Path from commands/ → repo root → public/data/upcoming_events.json
const EVENTS_PATH = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "data",
  "upcoming_events.json"
);

function loadEvents() {
  try {
    const raw = fs.readFileSync(EVENTS_PATH, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read upcoming_events.json:", e);
    return null;
  }
}

function toEmbedsFromList(list, categoryLabel) {
  if (!Array.isArray(list)) return [];
  return list.map((ev) => {
    const linkName = ev.button?.name ?? "Details";
    const linkUrl = ev.button?.link ?? null;
    const linkLine = linkUrl ? `\n[${linkName}](${linkUrl})` : "";
    return {
      title: ev.title ?? "Untitled Event",
      description:
        `**Category:** ${categoryLabel}` +
        `\n**Date:** ${ev.StartDate ?? "TBA"}` +
        `\n**Location:** ${ev.location ?? "TBA"}` +
        linkLine,
    };
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("events")
    .setDescription("Show upcoming DSMLC events from the website data")
    .addStringOption((o) =>
      o
        .setName("category")
        .setDescription("Filter by category")
        .addChoices(
          { name: "All", value: "all" },
          { name: "Workshops", value: "workshops" },
          { name: "Other Events", value: "other_events" },
          { name: "Final Comp", value: "final_comp" }
        )
    )
    .addIntegerOption((o) =>
      o
        .setName("limit")
        .setDescription("Max number of events to show (default 10)")
        .setMinValue(1)
        .setMaxValue(25)
    ),

  async execute(interaction) {
    const category = interaction.options.getString("category") ?? "all";
    const limit = interaction.options.getInteger("limit") ?? 10;

    const data = loadEvents();
    if (!data) {
      return interaction.reply({
        content: "Couldn't read upcoming events data.",
        ephemeral: true,
      });
    }

    let embeds = [];
    const wantAll = category === "all";

    if (wantAll || category === "workshops") {
      embeds = embeds.concat(toEmbedsFromList(data.workshops, "Workshops"));
    }
    if (wantAll || category === "other_events") {
      embeds = embeds.concat(
        toEmbedsFromList(data.other_events, "Other Events")
      );
    }
    if (wantAll || category === "final_comp") {
      embeds = embeds.concat(toEmbedsFromList(data.final_comp, "Final Comp"));
    }

    if (embeds.length === 0) {
      return interaction.reply({
        content: "No events found for that category.",
        ephemeral: true,
      });
    }

    // Respect Discord’s 10 embeds per message limit; chunk if needed.
    const chunks = [];
    for (let i = 0; i < Math.min(embeds.length, limit); i += 10) {
      chunks.push(embeds.slice(i, i + 10));
    }

    // First reply, then follow-ups if there are many
    await interaction.reply({ embeds: chunks[0] });
    for (let i = 1; i < chunks.length; i++) {
      await interaction.followUp({ embeds: chunks[i] });
    }
  },
};
