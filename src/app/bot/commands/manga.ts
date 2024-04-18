import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import MangaCommandInteraction from "../interactions/manga/MangaCommandInteraction";

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('manga')
        .setDescription('Busca un manga en la base de datos de anilist.')
        .setDMPermission(false)
        .addStringOption(opcion =>
            opcion
                .setName('nombre-o-id')
                .setDescription('El nombre o el ID con el que se va a buscar el manga.')
                .setRequired(true))
        .addBooleanOption(opcion => 
            opcion
                .setName('traducir')
                .setDescription('Si deseas traducir la sinopsis. (Traductor de Google)')),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const commandInteraction = new MangaCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}