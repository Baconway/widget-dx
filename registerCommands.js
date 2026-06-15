import "dotenv/config";

import { REST, Routes } from "discord.js";
import BuiltSetup from "./cmds/setup.js";
import BuiltReload from "./cmds/reload.js";

BuiltSetup.createCommand();
BuiltReload.createCommand();

const cmds = [];

cmds.push(BuiltSetup.build.toJSON());
cmds.push(BuiltReload.build.toJSON());

const rest = new REST().setToken(process.env.BOT_TOKEN);

const data = rest.put(Routes.applicationCommands(process.env.BOT_ID), {
  body: cmds,
});

console.log("completed reg");
