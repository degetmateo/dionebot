import { InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js";
import mongo from "../../database/mongo";
import GenericError from "../../errors/genericError";
import SuccessEmbed from "../../embeds/successEmbed";
import GuildChatInputCommandInteraction from "../../extensions/guildChatInputCommandInteraction.extension";

const execute = async (interaction: GuildChatInputCommandInteraction) => {
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
    
    const enabled = interaction.options.getBoolean('enabled', true);

    let membership = await mongo.memberships.findOne({
        _id: `${interaction.guild.id}_${interaction.user.id}` as any
    });

    if (!membership) {
        membership = {
            _id: `${interaction.guild.id}_${interaction.user.id}` as any,
            guild_id: interaction.guild.id,
            user_id: interaction.user.id,
            show_scores: enabled
        };

        await mongo.memberships.insertOne(membership);
    } else {
        await mongo.memberships.updateOne(
            {
                _id: membership._id
            },
            {
                $set: {
                    show_scores: enabled
                }
            }
        );
    };

    await interaction.editReply({
        embeds: [new SuccessEmbed(enabled ? 'Ahora tus puntuaciones se mostrarán en este servidor.' : 'Ahora tus puntuaciones NO se mostrarán en este servidor.')]
    });
};

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('show-scores')
        .setDescription('Show your scores for each anime being displayed in this server.')
        .setNSFW(false)
        .setContexts(InteractionContextType.Guild)
        .addBooleanOption(option => {
            return option
                .setName('enabled')
                .setDescription('If you want this feature to be enabled for you in this server.')
                .setRequired(true)
        }),
    execute: execute
};