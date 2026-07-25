import { EmbedBuilder, InteractionContextType, SlashCommandBuilder } from "discord.js";
import GuildChatInputCommandInteraction from "../../extensions/guildChatInputCommandInteraction.extension";
import VNDB from "../../apis/vndb/vndb.old";
import VNEmbed from "../../embeds/vnEmbed";
import mongo from "../../database/mongo";
import VNRowComponent from "../../builders/components/vn.row.component";
import vndb from "../../apis/vndb/vndb";
import VNScoresEmbed from "../../builders/embeds/vn.scores.embed";
import ErrorEmbed from "../../embeds/errorEmbed";

const execute = async (interaction: GuildChatInputCommandInteraction) => {
    await interaction.deferReply();

    const args = interaction.options.getString('name-or-id', true);
    const data = await VNDB.query(args);
    const media = data.results;

    const vnsEmbeds = media.map(vn => new VNEmbed(vn));
    const scoresEmbeds: EmbedBuilder[] = [];

    const collection = mongo.collection('members');
    const members = await collection.find(
        {
            $and: [
                {
                    "guilds.id": interaction.guild.id
                },
                {
                    "guilds.show_scores": true
                },
                {
                    vndb: { $ne: null }
                }
            ]
        }
    ).toArray();

    let index = 0;

    let selectedMembers = members.slice(0, 5);

    const scores = await vndb.scores(selectedMembers.map(member => {
        return {
            userId: member.vndb.id,
            username: member.vndb.username,
            userToken: member.vndb.auth.token,
            vnId: media[index].id
        }
    }));

    scoresEmbeds[index] = scores.length > 0 ?
        new VNScoresEmbed(scores):
        new ErrorEmbed('No hay votos para esta novela visual.');

    if (media.length === 1) {
        return await interaction.editReply({
            embeds: [vnsEmbeds[index], scoresEmbeds[index]]
        });
    };

    const id = interaction.client.set({
        members: selectedMembers,
        media,
        index,
        vnsEmbeds,
        scoresEmbeds
    }, 60_000);

    await interaction.editReply({
        embeds: [vnsEmbeds[index], scoresEmbeds[index]],
        components: [new VNRowComponent(id)]
    });
};

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('vn')
        .setDescription('Search a Visual Novel on VNDB.')
        .setContexts(InteractionContextType.Guild)
        .setNSFW(false)
        .addStringOption(option => {
            return option
                .setName('name-or-id')
                .setDescription('Name or ID of the Visual Novel.')
                .setRequired(true)
        }),
    execute: execute
};