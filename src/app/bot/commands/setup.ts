import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import SetupCommandInteraction from "../interactions/setup/SetupCommandInteraction";

module.exports = {
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Enlaza tu cuenta de anilist.')
        .setDMPermission(false),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const commandInteraction = new SetupCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}