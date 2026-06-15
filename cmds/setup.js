import "dotenv/config";

import {
  SlashCommandBuilder,
  SlashCommandStringOption,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextDisplayBuilder,
  AttachmentBuilder,
  ContainerBuilder,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";

import { sid_login, NET_login } from "../internals/net.js";

const segaID_option = new SlashCommandStringOption();
segaID_option.setRequired(true);
segaID_option.setName("segaid");
segaID_option.setDescription("your segaID");

const pw_option = new SlashCommandStringOption();
pw_option.setRequired(true);
pw_option.setName("password");
pw_option.setDescription("password");

const Oauth = new ButtonBuilder();
const row = new ActionRowBuilder();
const container = new ContainerBuilder();
const text = new TextDisplayBuilder();

Oauth.setURL(process.env.OAUTH_URL);
Oauth.setStyle(ButtonStyle.Link);
Oauth.setLabel("Verify");

row.addComponents(Oauth);

container.addTextDisplayComponents((textDisplay) =>
  textDisplay.setContent("# Widget setup"),
);
container.addTextDisplayComponents((textDisplay) =>
  textDisplay.setContent(
    "Your account should have the application. If not, verify it through the link.",
  ),
);
container.addTextDisplayComponents((textDisplay) =>
  textDisplay.setContent(
    "Then, run the **/reload** command to login, and fill your widget.",
  ),
);
container.addTextDisplayComponents((textDisplay) =>
  textDisplay.setContent(
    "After that, open your developer console (CTRL+Shift+I), and paste this:",
  ),
);
container.addSeparatorComponents((seperator) => seperator);
container.addTextDisplayComponents((textDisplay) =>
  textDisplay.setContent(
    `let _mods=webpackChunkdiscord_app.push([[Symbol()],{},e=>e.c]);\n
    webpackChunkdiscord_app.pop();\n
    let findByProps=(...e)=>{for(let t of Object.values(_mods))try{if(!t.exports||t.exports===window)continue;if(e.every(e=>t.exports?.[e]))return t.exports;for(let r in t.exports)if(e.every(e=>t.exports?.[r]?.[e])&&'IntlMessagesProxy'!==t.exports[r][Symbol.toStringTag])return t.exports[r]}catch{}};

    \nfindByProps("getFeaturedApplicationIds").getFeaturedApplicationIds().push(${process.env.BOT_ID})`,
  ),
);
container.addSeparatorComponents((seperator) => seperator);
container.addTextDisplayComponents((textDisplay) =>
  textDisplay.setContent("## Your ID and password are **not** saved."),
);
container.addActionRowComponents(row);

class WidgetSetup {
  constructor(name = "placeholder", description = "placeholder") {
    this.name = name;
    this.description = description;
  }

  createCommand(params) {
    this.build = new SlashCommandBuilder();
    this.build.setName(this.name);
    this.build.setDescription(this.description);
  }

  async execute(interaction) {
    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2,
      ephemeral: true,
    });
  }
}

export default new WidgetSetup("setup", "Setup your widget here");
