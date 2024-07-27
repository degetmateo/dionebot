import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import MangaCommandInteraction from "../interactions/manga/MangaCommandInteraction";

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('manga')
        .setDescription('Search for a manga!')
        .setDescriptionLocalization('es-ES', 'Busca un manga!')
        .setDMPermission(false)
        .setNSFW(false)
        .addStringOption((option) =>
            option
                .setName('name-or-id')
                .setNameLocalization('es-ES', 'nombre-o-id')
                .setDescription('Name or id of the manga you want to search for.')
                .setDescriptionLocalization('es-ES', 'Nombre o id del manga que quieres buscar.')
                .setRequired(true)),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const commandInteraction = new MangaCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}