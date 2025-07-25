import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import BChatInputCommandInteraction from "../../extensions/interaction";

module.exports = {
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('dev')
        .setDescription('dev')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute: async (interaction: BChatInputCommandInteraction) => {
        const guilds = interaction.client.guilds.cache.map(g => g.id);
        console.log(guilds);
    }
};