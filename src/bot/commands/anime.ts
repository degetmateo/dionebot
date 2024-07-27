import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, SlashCommandStringOption, SlashCommandBooleanOption } from "discord.js";
import AnimeCommandInteraction from "../interactions/anime/AnimeCommandInteraction";

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription('Search for an anime!')
        .setDescriptionLocalization('es-ES', 'Busca un anime!')
        .setDMPermission(false)
        .setNSFW(false)
        .addStringOption((option) =>
            option
                .setName('name-or-id')
                .setNameLocalization('es-ES', 'nombre-o-id')
                .setDescription('Name or id of the anime you want to search for.')
                .setDescriptionLocalization('es-ES', 'Nombre o id del anime que quieres buscar.')
                .setRequired(true)),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
        const commandInteraction = new AnimeCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}