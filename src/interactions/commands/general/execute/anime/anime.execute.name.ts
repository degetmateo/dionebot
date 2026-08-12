import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import GuildChatInputCommandInteraction from "../../../../../extensions/guildChatInputCommandInteraction.extension";
import mongo from "../../../../../database/mongo";
import AnimeValidator from "../../../../../validators/animeValidator";
import anilist from "../../../../../apis/anilist/anilist";
import Anianime from "../../../../../apis/anilist/models/anianime";
import AnimeEmbed from "../../../../../embeds/animeEmbed";
import ErrorEmbed from "../../../../../embeds/errorEmbed";
import commonRequests from "../../../../../apis/common/common.requests";
import ScoresEmbed from "../../../../../embeds/scoresEmbed";

const animeExecuteName = async (interaction: GuildChatInputCommandInteraction) => {
    const name = interaction.options.getString('name-or-id') as string;

    const memberships = await mongo.memberships.find({
        guild_id: interaction.guild.id,
        show_scores: true
    }).toArray();

    const members = await mongo.users.find(
        { 
            $and: [
                {
                    _id: {
                        $in: memberships.map(m => m.user_id)
                    }
                },
                {
                    preferred_platform: { $ne: null } 
                }
            ] 
        }
    ).toArray();

    AnimeValidator.validateName(name);

    const media = await anilist.search.anime.name(name);    
    const embeds = media.map((m: Anianime) => new AnimeEmbed(m));
    const scoresEmbeds: EmbedBuilder[] = [];

    let index = 0;    

    if (members.length <= 0) {
        scoresEmbeds[index] = new ErrorEmbed('¡Parece que nadie conoce esto!');
    } else {
        const scores = await commonRequests.search.scores({
            id: media[index].getId(),
            idMal: media[index].getMalId(),
            type: 'ANIME'
        }, members as any);

        scoresEmbeds[index] = scores.length > 0 ?
            new ScoresEmbed(scores) :
            new ErrorEmbed('¡Parece que nadie conoce esto!');
    };
    
    const cacheId = interaction.client.set({
        members: members,
        embeds: embeds,
        media: media.map(m => m.data),
        scores: scoresEmbeds,
        index: index
    }, 180_000);

    const row = new ActionRowBuilder<ButtonBuilder>();
    const backButton = new ButtonBuilder()
        .setCustomId(`media-back-button_${cacheId}`)
        .setLabel('←')
        .setStyle(ButtonStyle.Primary);
    const nextButton = new ButtonBuilder()
        .setCustomId(`media-next-button_${cacheId}`)
        .setLabel('→')
        .setStyle(ButtonStyle.Primary);
    row.addComponents(backButton, nextButton);

    await interaction.editReply({
        embeds: [embeds[index], scoresEmbeds[index]],
        components: [row]
    });
};

export default animeExecuteName;