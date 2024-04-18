import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, PermissionFlagsBits } from "discord.js";
import AdminSetupCommandInteraction from "../interactions/admin-setup/AdminSetupCommandInteraction";

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('admin-setup')
        .setDescription("Registra la cuenta de anilist de un usuario.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption(option => 
            option
                .setName('plataforma')
                .setDescription('Plataformas.')
                .addChoices(
                    { name: 'Anilist', value: 'Anilist' },
                    { name: 'MyAnimeList', value: 'MyAnimeList' },
                    { name: 'VisualNovelDatabase', value: 'VisualNovelDatabase' })
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('Usuario de discord.')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('nombre-o-id')
                .setDescription('Nombre o ID del usuario en la plataforma.')
                .setRequired(true)),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
        const commandInteraction = new AdminSetupCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}