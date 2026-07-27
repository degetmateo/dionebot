import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, Interaction, InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js";
import * as uuid from 'uuid';
import responsesHelper from "../../helpers/responses.helper";
import ErrorEmbed from "../../embeds/errorEmbed";
import GuildChatInputCommandInteraction from "../../extensions/guildChatInputCommandInteraction.extension";
import mongo from "../../database/mongo";
import { UUID } from "mongodb";
import { memberModel } from "../../database/models/member.model";

const execute = async (interaction: GuildChatInputCommandInteraction) => {
    try {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const members = mongo.collection('members');
        let member = await members.findOne({ discord_id: interaction.user.id });

        const embed = new EmbedBuilder();
        embed.setColor(Colors.DarkOrange);

        if (!member) {
            member = memberModel.create(interaction.user.id, interaction.guild.id as string);
            await members.insertOne(member);

            let desc = 
                `**¡Perfil creado correctamente!**\n`+
                `¿Deseas customizarlo o vincular una plataforma?\n\n`+
                `▸ Ten en cuenta que MAL y VNDB aún posee algunas limitaciones que estamos intentando solucionar.`;

            embed.setDescription(desc);
        } else {
            let desc = 
                `**¡Ya tienes un perfil!**\n`+
                `¿Deseas customizarlo o vincular una plataforma?\n\n`+
                `▸ Ten en cuenta que \`MyAnimeList\` y \`VNDB\` aún posee limitaciones que estamos intentando solucionar.`;

            embed.setDescription(desc);
        };

        const id = interaction.client.set(member, 60_000);

        const row = new ActionRowBuilder<ButtonBuilder>();
        row.addComponents([
            new ButtonBuilder()
                .setCustomId(`setup-profile-button_${id}`)
                .setLabel('Customizar')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`setup-anilist-button_${id}`)
                .setLabel('ANILIST')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`setup-mal-button_${id}`)
                .setLabel('MyAnimeList')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`setup-vndb-button_${id}`)
                .setLabel('VNDB')
                .setStyle(ButtonStyle.Secondary)
        ]);

        await interaction.editReply({
            embeds: [embed],
            components: [row]
        });
    } catch (error: any) {
        console.error(error);
        await responsesHelper.execute(interaction, [new ErrorEmbed(error.message)], { flags: [MessageFlags.Ephemeral] });
    };
};

module.exports = {
    cooldown: 30,
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup your profile.')
        .setDescriptionLocalization('es-ES', 'Crea tu perfil.')
        .setDescriptionLocalization('es-419', 'Crea tu perfil.')
        .setNSFW(false)
        .setContexts(InteractionContextType.Guild),
    execute: execute
};