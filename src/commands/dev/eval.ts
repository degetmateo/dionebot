import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import GuildChatInputCommandInteraction from "../../extensions/guildChatInputCommandInteraction.extension";
import GenericError from "../../errors/genericError";
import Helpers from "../../helpers";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('eval')
        .setNSFW(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => 
            option
                .setName('value')
                .setDescription('value')
                .setRequired(true)
        ),
    execute: async (interaction: GuildChatInputCommandInteraction) => {
        if (interaction.user.id != process.env.DEV_ID) {
            throw new GenericError('Unauthorized.');
        };

        const value = interaction.options.getString('value', true);
        const args = value.split(' ');
        const prefix = args[0];

        if (prefix === 'ccc') {
            const cooldown = args[1];

            if (!cooldown) throw new GenericError('Cooldown is required.');
            if (!Helpers.isNumber(cooldown)) throw new GenericError('Cooldown must be a number.');

            interaction.client.settings.ch_claim_cooldown = Number(cooldown);

            interaction.reply({
                content: "Done.",
                flags: "Ephemeral"
            });
        };
    }
};