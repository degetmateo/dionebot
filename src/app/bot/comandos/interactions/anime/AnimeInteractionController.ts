import { CacheType, ChatInputCommandInteraction } from "discord.js";
import Anime from "../../../apis/anilist/modelos/media/Anime";
import EmbedAnime from "../../../embeds/EmbedAnime";
import AnilistAPI from "../../../apis/anilist/AnilistAPI";
import EmbedScores from "../../../embeds/EmbedScores";
import InteractionController from "../InteractionController";
import Helpers from "../../../Helpers";

export default class AnimeInteractionController extends InteractionController {
    protected media: Array<Anime>;

    constructor (interaction: ChatInputCommandInteraction<CacheType>, animes: Array<Anime>) {
        super(interaction, animes);
    }

    public async execute (): Promise<void> {
        const serverId = this.interaction.guildId;
        const users = this.bot.servers.getUsers(serverId);
        const translate = this.interaction.options.getBoolean('traducir') || false;

        this.embeds = translate ?
            await Helpers.asyncMap(this.media, async anime => await EmbedAnime.CreateTranslated(anime)) :
            this.media.map(media => EmbedAnime.Create(media));

        const anime = this.media[this.page];
        const scores = await this.fetchUsersUsernames(await AnilistAPI.fetchUsersScores(anime.getId() + '', users.map(u => u.anilistId)));

        const embedAnime = this.embeds[this.page];
        const embedScores = EmbedScores.Create(scores).setColor(anime.getColor());

        const embeds = (!scores.isEmpty()) ?
            [embedAnime, embedScores] : [embedAnime];


        if (this.media.length === 1) {
            await this.interaction.editReply({
                embeds: embeds
            })

            return;
        }

        const res = await this.interaction.editReply({
            embeds: embeds,
            components: [this.row]
        })

        await this.createCollector(res);
    }
}