import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, PermissionFlagsBits } from "discord.js";
import AdminUnsetupCommandInteraction from "./interactions/admin-unsetup/AdminUnsetupCommandInteraction";

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('admin-unsetup')
        .setDescription("Elimina la cuenta de anilist de un usuario.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addUserOption(option =>
            option
            .setName('usuario')
            .setDescription('Usuario de discord.')
            .setRequired(true)),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
        const commandInteraction = new AdminUnsetupCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}