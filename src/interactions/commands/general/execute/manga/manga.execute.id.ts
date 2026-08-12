import anilist from "../../../../../apis/anilist/anilist";
import commonRequests from "../../../../../apis/common/common.requests";
import mongo from "../../../../../database/mongo";
import ErrorEmbed from "../../../../../embeds/errorEmbed";
import MangaEmbed from "../../../../../embeds/mangaEmbed";
import ScoresEmbed from "../../../../../embeds/scoresEmbed";
import GuildChatInputCommandInteraction from "../../../../../extensions/guildChatInputCommandInteraction.extension";
import AnimeValidator from "../../../../../validators/animeValidator";


const mangaExecuteId = async (interaction: GuildChatInputCommandInteraction) => {
    const id = interaction.options.getString('name-or-id') as string;

    const memberships = await mongo.memberships.find({
        guild_id: interaction.guild.id,
        show_scores: true
    }).toArray();

    const users = await mongo.users.find(
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

    AnimeValidator.validateId(id);

    const data = await anilist.search.manga.id(id);

    const mangaEmbed = new MangaEmbed(data);

    if (users.length <= 0) {
        return await interaction.editReply({
            embeds: [mangaEmbed]
        });
    };

    const scores = await commonRequests.search.scores({
        ...data,
        type: 'MANGA'
    }, users as any);

    const scoresEmbed = scores.length > 0 ?
        new ScoresEmbed(scores) :
        new ErrorEmbed('¡Parece que nadie conoce esto!');

    await interaction.editReply({
        embeds: [mangaEmbed, scoresEmbed]
    });
};

export default mangaExecuteId;