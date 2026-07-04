import {
  SlashCommandBuilder,
  SlashCommandStringOption,
  MessageFlags,
} from "discord.js";
import { JSDOM } from "jsdom";
import { Worker } from "node:worker_threads";

import { DEFAULT_HEADERS, sid_login, NET_login } from "../internals/net.js";
import { updateWidget } from "../internals/misc.js";

const token_option = new SlashCommandStringOption();
token_option.setRequired(true);
token_option.setName("token");
token_option.setDescription("your account token");

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

    this.build.addStringOption(token_option);
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

    const cookie = interaction.options.get("token");

    let user_cookies = await NET_login(cookie.value);

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

export default new WidgetSetup(
  "reload_token",
  "For reloading your widget (with token)",
);
