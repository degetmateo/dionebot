import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import SetupCommandInteraction from "./interactions/setup/SetupCommandInteraction";

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription("Enlaza tu cuenta de una de estas plataformas.")
        .setDMPermission(false)
        .addStringOption(option => 
            option
                .setName('plataforma')
                .setDescription('Plataformas actualmente disponibles.')
                .addChoices(
                    { name: 'Anilist', value: 'Anilist' },
                    { name: 'MyAnimeList', value: 'MyAnimeList' },
                    { name: 'VisualNovelDatabase', value: 'VisualNovelDatabase' })
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('nombre-o-id')
                .setDescription('Tu nombre o ID de usuario.')
                .setRequired(true)),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const commandInteraction = new SetupCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}