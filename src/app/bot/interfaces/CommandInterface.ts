import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export default interface CommandInterface {
    readonly cooldown: number;

    readonly data:
    | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder;

    execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void>;
}