import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import GuildChatInputCommandInteraction from "../../../extensions/guildChatInputCommandInteraction.extension";
import GenericError from "../../../errors/genericError";
import Helpers from "../../../helpers";
import SettingsModule from "../../../modules/settings.module";

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

            interaction.client.settings.character_claim_cooldown = Number(cooldown);
            await SettingsModule.save(interaction.client.settings);

            interaction.reply({
                content: "Done.",
                flags: "Ephemeral"
            });
        };

        if (prefix === 'renas') {
            const renas = args[1];

            if (!renas) throw new GenericError('Renas are required.');
            if (!Helpers.isNumber(renas)) throw new GenericError('Renas must be a number.');

            const settings = await SettingsModule.read();

            settings.renas_per_reclaim = Number(renas);
            interaction.client.settings = settings;

            await SettingsModule.save(settings);

            interaction.reply({
                content: "Done.",
                flags: "Ephemeral"
            });
        };

        if (prefix === 'maintenance') {
            let x:any = Number(args[1]);
            
            if (x == 1) x = true;
            else if (x == 0) x = false;
            else x = false;

            interaction.client.settings.maintenance = x;

            await SettingsModule.save(interaction.client.settings);

            interaction.reply({
                flags: "Ephemeral",
                content: 'Done.'
            });
        };
    }
};