import { InteractionContextType, SlashCommandBuilder } from "discord.js";
import { characterGetbyId } from "./character/character.get-by-id";
import { characterGetbyName } from "./character/character.get-by-name";
import GuildChatInputCommandInteraction from "../../../extensions/guildChatInputCommandInteraction.extension";
import Helpers from "../../../helpers";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('character')
        .setDescription('Buscar un personaje y toda su información.')
        .setNSFW(false)
        .setContexts(InteractionContextType.Guild)
        .addStringOption(option =>
            option
                .setName('name-or-id')
                .setDescription('Nombre o identificador del personaje.')
                .setRequired(true)
        ),
    execute: async (interaction: GuildChatInputCommandInteraction) => {
        const args = interaction.options.getString('name-or-id', true);
        
        return Helpers.isNumber(args) ?
            await characterGetbyId(interaction):
            await characterGetbyName(interaction);
    }
};