import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, SlashCommandStringOption, SlashCommandBooleanOption } from "discord.js";
import AnimeCommandInteraction from "./interactions/anime/AnimeCommandInteraction";

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription('Busca un anime en la base de datos de anilist.')
        .setDMPermission(false)
        .addStringOption((opcion: SlashCommandStringOption) =>
            opcion
                .setName('nombre-o-id')
                .setDescription('El nombre o el ID con el que se va a buscar el anime.')
                .setRequired(true))
        .addBooleanOption((opcion: SlashCommandBooleanOption) => 
            opcion
                .setName('traducir')
                .setDescription('Si deseas traducir la sinopsis.')),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
        const commandInteraction = new AnimeCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}