import {
  SlashCommandBuilder,
  SlashCommandStringOption,
  MessageFlags,
} from "discord.js";
import { JSDOM } from "jsdom";
import { Worker } from "node:worker_threads";

import { DEFAULT_HEADERS, sid_login, NET_login } from "../internals/net.js";
import { updateWidget } from "../internals/misc.js";

const segaID_option = new SlashCommandStringOption();
segaID_option.setRequired(true);
segaID_option.setName("segaid");
segaID_option.setDescription("your segaID");

const pw_option = new SlashCommandStringOption();
pw_option.setRequired(true);
pw_option.setName("password");
pw_option.setDescription("password");

const workerPaths = [
  "./internals/user.js",
  "./internals/circle.js",
  "./internals/stats.js",
];

class WidgetSetup {
  constructor(name = "placeholder", description = "placeholder") {
    this.name = name;
    this.description = description;
  }

  createCommand(params) {
    this.build = new SlashCommandBuilder();
    this.build.setName(this.name);
    this.build.setDescription(this.description);

    this.build.addStringOption(segaID_option);
    this.build.addStringOption(pw_option);
  }

  createPromiseWorker(path, user_cookies, interaction) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(path);
      worker.postMessage(user_cookies);

      worker.on("message", async (data) => {
        await interaction.editReply(`finished ${path}`);
        resolve(data);
      });
    });
  }

  async execute(interaction) {
    await interaction.reply({
      content: "Credentials received, Logging in",
      flags: MessageFlags.Ephemeral,
    });

    const { cookie } = await sid_login(
      interaction.options.get("segaid"),
      interaction.options.get("password"),
    );

    let user_cookies = await NET_login(cookie);
    const workerHolder = [];

    for (let index = 0; index < workerPaths.length; index++) {
      const element = workerPaths[index];
      const PormiseWorker = this.createPromiseWorker(
        element,
        user_cookies,
        interaction,
      );
      workerHolder.push(PormiseWorker);
    }
    await interaction.editReply({
      content: "Getting Player Data",
      flags: MessageFlags.Ephemeral,
    });

    const [user, circle, stats] = await Promise.all(workerHolder);

    await interaction.editReply({
      content: "Updating Widget",
      flags: MessageFlags.Ephemeral,
    });
    updateWidget(
      {
        ...user,
        ...circle,
        ...stats,
      },
      interaction.user.id,
    );

    user_cookies = null;

    await interaction.editReply({
      content: "Update Complete!",
      flags: MessageFlags.Ephemeral,
    });
  }
}

export default new WidgetSetup("reload", "For reloading your widget");
