require("dotenv").config();
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  ActivityType,
  PresenceUpdateStatus,
  Events,
  REST,
  Routes,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
  ],
});

const deployCommands = async () => {
  try {
    const commands = [];
    const commandFiles = fs
      .readdirSync(path.join(__dirname, "commands"))
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const cmd = require(`./commands/${file}`);
      if ("data" in cmd && "execute" in cmd) {
        commands.push(cmd.data.toJSON());
      } else {
        console.log("WARNING file missing data or execute");
      }
    }
    const rest = new REST().setToken(process.env.BOT_TOKEN);
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
  } catch (error) {
    console.error(error);
  }
};
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`The command ${filePath} is missing data or execute`);
  }
}

client.once(Events.ClientReady, async () => {
  console.log("ready");

  await deployCommands();
  console.log("deployed commands globally");

  const statusType = process.env.BOT_STATUS || "online";
  const activityType = process.env.ACTIVITY_TYPE || "playing";
  const activityName = process.env.ACTIVITY_NAME || "DSMLC";

  const activityTypeMap = {
    PLAYING: ActivityType.Playing,
    WATCHING: ActivityType.Watching,
    LISTENING: ActivityType.Listening,
    STREAMING: ActivityType.Streaming,
    COMPETING: ActivityType.Competing,
  };

  const statusMap = {
    online: PresenceUpdateStatus.Online,
    idle: PresenceUpdateStatus.Idle,
    dnd: PresenceUpdateStatus.DoNotDisturb,
    invisible: PresenceUpdateStatus.Invisible,
  };

  client.user.setPresence({
    status: statusMap[statusType],
    activities: [
      {
        name: activityName,
        type: activityTypeMap[activityType],
      },
    ],
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command",
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.BOT_TOKEN);
