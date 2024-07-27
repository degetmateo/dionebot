import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import SuggestionCommandInteraction from "../interactions/suggestion/SuggestionCommandInteracion";

module.exports = {
    cooldown: 60,
    data: new SlashCommandBuilder()
        .setName('suggestion')
        .setNameLocalization('es-ES', 'sugerencia')
        .setDescription('Send us a suggestion!')
        .setDescriptionLocalization('es-ES', '¡Envíanos una sugerencia!')
        .setDMPermission(false)
        .setNSFW(false)
        .addStringOption(option =>
            option
                .setName('suggestion')
                .setNameLocalization('es-ES', 'sugerencia')
                .setDescription('Your suggestion.')
                .setDescriptionLocalization('es-ES', 'Tu sugerencia.')
                .setRequired(true)
        ),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const commandInteraction = new SuggestionCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}