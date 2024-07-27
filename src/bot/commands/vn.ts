import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import VNCommandInteraction from "../interactions/vn/VNCommandInteraction";

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('vn')
        .setDescription('Search for a visual novel!')
        .setDescription('Busca una novela visual!')
        .setDMPermission(false)
        .addStringOption(option =>
            option
                .setName('name-or-id')
                .setNameLocalization('es-ES', 'nombre-o-id')
                .setDescription('Name or id of the visual novel you want to search for.')
                .setDescription('Nombre o id de la novela visual a la que quieres buscar.')
                .setRequired(true)),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const commandInteraction = new VNCommandInteraction(interaction);
        await commandInteraction.execute();    
    }
}