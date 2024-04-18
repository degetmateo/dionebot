import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import VNCommandInteraction from "../interactions/vn/VNCommandInteraction";

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('vn')
        .setDescription('Obtén información acerca de una novela visual.')
        .setDMPermission(false)
        .addStringOption(opcion =>
            opcion
                .setName('nombre-o-id')
                .setDescription('El nombre o el ID con el que se va a buscar la novela visual.')
                .setRequired(true))
        .addBooleanOption(opcion =>
            opcion
                .setName('traducir')
                .setDescription('Indicar si la información obtenida debe traducirse al español.')),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const commandInteraction = new VNCommandInteraction(interaction);
        await commandInteraction.execute();    
    }
}