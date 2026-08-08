import { InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import GuildChatInputCommandInteraction from "../../extensions/guildChatInputCommandInteraction.extension";
import GenericError from "../../errors/genericError";
import mongo from "../../database/mongo";
import SuccessEmbed from "../../embeds/successEmbed";

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('admin-unsetup')
        .setDescription('Desvincular un usuario de este servidor.')
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setNSFW(false)
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('El usuario a desvincular.')
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName('user-id')
                .setDescription('La ID del usuario a desvincular.')
                .setRequired(false)
        ),
    execute: async (interaction: GuildChatInputCommandInteraction) => {
        const optionsUser = interaction.options.getUser('user', false);
        const optionsUserId = interaction.options.getString('user-id', false);

        if ((!optionsUser) && (!optionsUserId)) {
            throw new GenericError('Debes, por lo menos, ingresar un usuario o su ID.');
        };

        const userId = optionsUser ? optionsUser.id : optionsUserId;

        await mongo.memberships.deleteOne({
            _id: `${interaction.guild.id}_${userId}` as any
        });

        await interaction.reply({
            flags: [MessageFlags.Ephemeral],
            embeds: [new SuccessEmbed(`Hemos desvinculado a <@${userId}> correctamente.`)]
        });
    }
};