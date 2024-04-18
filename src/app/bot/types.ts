import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"

export type Command = {
    cooldown: number,
    data: SlashCommandBuilder,
    execute: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>
}