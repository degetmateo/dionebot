import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, PermissionFlagsBits } from "discord.js";
import AdminSetupCommandInteraction from "../interactions/admin-setup/AdminSetupCommandInteraction";

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('admin-setup')
        .setDescription("Enlaza la cuenta de anilist de un usuario.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('Usuario de discord.')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('nombre-o-id')
                .setDescription('Nombre o ID del usuario.')
                .setRequired(true)),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
        const commandInteraction = new AdminSetupCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}