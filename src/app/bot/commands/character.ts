import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import CharacterCommandInteraction from "../interactions/character/CharacterCommandInteraction";

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('character')
        .setNameLocalization('es-ES', 'personaje')
        .setDescription('Search for a character!')
        .setDescriptionLocalization('es-ES', 'Busca un personaje!')
        .setNSFW(false)
        .setDMPermission(false)
        .addStringOption(option =>
            option
                .setName('name-or-id')
                .setNameLocalization('es-ES', 'nombre-o-id')
                .setDescription('Name or id of the character you want to search for.')
                .setDescriptionLocalization('es-ES', 'Nombre o id del personaje al que quieres buscar.')
                .setRequired(true)
        ),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const commandInteraction = new CharacterCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}