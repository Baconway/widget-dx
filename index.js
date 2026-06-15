import "dotenv/config";
import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  SlashCommandBuilder,
} from "discord.js";

import BuiltTest from "./cmds/setup.js";
import BuiltReload from "./cmds/reload.js";

const client = new Client({ intents: [GatewayIntentBits.DirectMessages] });
const testCollection = new Collection();

BuiltTest.createCommand();
BuiltReload.createCommand();

testCollection.set(BuiltTest.name, BuiltTest);
testCollection.set(BuiltReload.name, BuiltReload);

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const retrievedCMD = testCollection.get(interaction.commandName);
  await retrievedCMD.execute(interaction);
});

client.once("clientReady", () => console.log("i run now"));

client.login(process.env.BOT_TOKEN);
