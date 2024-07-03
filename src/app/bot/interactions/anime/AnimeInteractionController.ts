import { CacheType, ChatInputCommandInteraction } from "discord.js";
import Helpers from "../../Helpers";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import Anime from "../../apis/anilist/modelos/media/Anime";
import EmbedAnime from "../../embeds/EmbedAnime";
import EmbedScores from "../../embeds/EmbedScores";
import InteractionController from "../InteractionController";
import Postgres from "../../../database/postgres";
import { UserSchema } from "../../../database/types";

export default class AnimeInteractionController extends InteractionController {
    protected media: Array<Anime>;

    constructor (interaction: ChatInputCommandInteraction<CacheType>, animes: Array<Anime>) {
        super(interaction, animes);
    }

    public async execute (): Promise<void> {
        const serverId = this.interaction.guild.id;
        const translate = this.interaction.options.getBoolean('traducir') || false;

        const queryUsers: Array<UserSchema> = await Postgres.query() `
            SELECT * FROM
                discord_user
            WHERE
                id_server = ${serverId};
        `;

        console.log(queryUsers)

        this.embeds = translate ?
            await Helpers.asyncMap(this.media, async anime => await EmbedAnime.CreateTranslated(anime)) :
            this.media.map(media => EmbedAnime.Create(media));

        const anime = this.media[this.page];
        const scores = await this.fetchUsersUsernames(await AnilistAPI.fetchUsersScores(anime.getId() + '', queryUsers.map(u => u.id_anilist+'')));

        const embedAnime = this.embeds[this.page];
        const embedScores = EmbedScores.Create(scores).setColor(anime.getColor());

        const embeds = (!scores.isEmpty()) ?
            [embedAnime, embedScores] : [embedAnime];


        if (this.media.length === 1) {
            await this.interaction.reply({
                embeds: embeds
            })

            return;
        }

        try {
            const res = await this.interaction.reply({
                embeds: embeds,
                components: [this.row],
                fetchReply: true
            })
    
            await this.createCollector(res);
        } catch (error) {
            throw error;
        }
    }
}