// discord-bot/commands/debt.js
const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "debts.json");

function readStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "{}");
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw || "{}");
  } catch (e) {
    console.error("Failed to read store:", e);
    return {};
  }
}

function writeStore(obj) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2));
  } catch (e) {
    console.error("Failed to write store:", e);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("debt")
    .setDescription("Add or subtract debt for a person")
    .addStringOption((o) =>
      o.setName("name").setDescription("Person's name").setRequired(true)
    )
    .addStringOption((o) =>
      o
        .setName("action")
        .setDescription("Add or subtract from their debt")
        .addChoices(
          { name: "add", value: "add" },
          { name: "subtract", value: "subtract" }
        )
        .setRequired(true)
    )
    .addNumberOption((o) =>
      o
        .setName("amount")
        .setDescription("Amount to add or subtract")
        .setMinValue(0)
        .setRequired(true)
    ),

  async execute(interaction) {
    const nameRaw = interaction.options.getString("name", true);
    const action = interaction.options.getString("action", true); // "add" | "subtract"
    const amount = interaction.options.getNumber("amount", true);

    const name = nameRaw.trim();
    if (!name) {
      return interaction.reply({
        content: "Name cannot be empty.",
        ephemeral: true,
      });
    }

    const store = readStore();
    const guildId = interaction.guildId || "DM";
    if (!store[guildId]) store[guildId] = {};

    const current = Number(store[guildId][name] || 0);
    const delta = action === "add" ? amount : -amount;
    const updated = current + delta;

    store[guildId][name] = Number(updated.toFixed(2)); // keep it neat
    writeStore(store);

    const sign = delta >= 0 ? "+" : "-";
    const prettyDelta = `${sign}$${Math.abs(delta).toFixed(2)}`;
    const prettyBal = `$${store[guildId][name].toFixed(2)}`;

    await interaction.reply(
      `Updated **${name}**: ${prettyDelta}. DSMLC OWES: **${prettyBal}**.`
    );
  },
};
