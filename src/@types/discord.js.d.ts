import { Collection, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Shoukaku } from "shoukaku";

export interface Command {
  data: SlashCommandBuilder;
  execute: (client: ExtendedClient, interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface ExtendedClient extends Client {
  commands: Collection<string, Command>;
  shoukaku: Shoukaku;
}

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, Command>;
    shoukaku: Shoukaku;
  }
}